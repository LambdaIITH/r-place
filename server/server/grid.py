from threading import Lock
from utils import grid_queries, conn, verify_auth_token
from fastapi import Depends, FastAPI, HTTPException, Response

ROWS = 80
COLUMNS = 80
COLORS = 32
COOLDOWN_TIME = 30  # in seconds
INITIAL_COLOR = 0

grid_app = FastAPI()

current_grid = [[INITIAL_COLOR for _ in range(COLUMNS)] for _ in range(ROWS)]
latest_insertion = int(grid_queries.get_latest_id(conn)[0] or 0)
insertion_lock = Lock()

# initialize the in-mem grid
for x, y, color in grid_queries.get_full_grid(conn):
    current_grid[x][y] = color
print("Initialized grid.")


def are_bounds_valid(row: int, col: int) -> bool:
    return 0 <= row < ROWS and 0 <= col < COLUMNS


def is_color_valid(color: int) -> bool:
    return 0 <= color < COLORS


def get_user_cooldown(email: str):
    time_since_last_req = grid_queries.get_time_since_last_update(conn, email=email)[0]
    if time_since_last_req is None:
        return 0
    return max(COOLDOWN_TIME-float(time_since_last_req), 0)


@grid_app.post("/pixel/{row}/{col}/{color}")
async def pixel(row: int, col: int, color: int, response: Response, email: str = Depends(verify_auth_token)):
    global insertion_lock, current_grid, latest_insertion
    if not are_bounds_valid(row, col) or not is_color_valid(color):
        response.status_code = 400
        return {"message": "Invalid pixel coordinates or color."}

    cooldown = get_user_cooldown(email)
    if (cooldown > 0):
        response.status_code = 429
        return {"message": "You are on cooldown.", "cooldown": cooldown}

    try:
        insertion_lock.acquire()
        latest_insertion = int(grid_queries.log_update(conn, x=row, y=col, color=color, email=email))
        current_grid[row][col] = color
        print(latest_insertion)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        insertion_lock.release()

    return {"message": "Pixel updated successfully."}


@grid_app.get("/full_grid")
def full_grid():
    """
    Return the full grid and the latest insertion id.
    """
    global current_grid, latest_insertion

    return {"grid": current_grid, "last update": latest_insertion}


@grid_app.get("/updates/{last_updated}")
def updates(last_updated: int):
    """
    Return the updates since the last update.
    """
    global current_grid, latest_insertion

    updates = []
    for x, y, color in grid_queries.get_updates(conn, last_updated=last_updated):
        updates.append({"row": x, "col": y, "color": color})

    return {"updates": updates, "last update": latest_insertion}


@grid_app.get("/cooldown")
async def cooldown(email: str = Depends(verify_auth_token)):
    """
    Return the cooldown time.
    """
    return get_user_cooldown(email)


@grid_app.get("/pixel/{row}/{col}/history")
async def pixel_history(row: int, col: int):
    """
    Return the history of a pixel (last 5 updates).
    """
    if not are_bounds_valid(row, col):
        raise HTTPException(
            status_code=400, detail="Invalid pixel coordinates."
        )
    result = grid_queries.get_pixel_history(conn, x=row, y=col)

    # parse this list of tuples into a list of dicts
    res_final = []
    for row in result:
        res_final.append({"email": row[0], "timestamp": row[1], "color": row[2], "name": row[3]})

    return res_final
