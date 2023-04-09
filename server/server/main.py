import os
import time
from typing import Union

import psycopg2
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from psycopg2.extras import Json, RealDictCursor
from pydantic import BaseModel
from threading import Lock
import aiosql
import json

from auth import get_user_email

load_dotenv()

ROWS = 80
COLUMNS = 80
COLORS = 32
COOLDOWN_TIME = 600  # in seconds

DATABASE = os.getenv("DATABASE")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASS = os.getenv("POSTGRES_PASS")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

queries = aiosql.from_path("./queries.sql", "psycopg2")

conn = psycopg2.connect(
    database=DATABASE,
    user=POSTGRES_USER,
    password=POSTGRES_PASS,
    host=POSTGRES_HOST,
    port=POSTGRES_PORT,
)
conn.autocommit = True
print("Opened database successfully!")

INITIAL_COLOR = 0

current_grid = [[INITIAL_COLOR for _ in range(COLUMNS)] for _ in range(ROWS)]
latest_insertion = int(queries.get_latest_id(conn)[0] or 0)

insertion_lock = Lock()

# initialize the in-mem grid
for x, y, color in queries.get_full_grid(conn):
    current_grid[x][y] = color
print("Initialized grid.")


def verify_auth_token(Authorization: str = Header()):
    email = get_user_email(Authorization)
    if email is None:
        raise HTTPException(
            status_code=401, detail="We are not able to authenticate you."
        )
    return email


def are_bounds_valid(row: int, col: int) -> bool:
    return 0 <= row < ROWS and 0 <= col < COLUMNS


def is_color_valid(color: int) -> bool:
    return 0 <= color < COLORS


def get_user_cooldown(email: str):
    time_since_last_req = queries.get_time_since_last_update(conn, email=email)[0]
    if time_since_last_req is None:
        return 0
    return max(COOLDOWN_TIME-float(time_since_last_req), 0)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/auth")
async def auth(email: str = Depends(verify_auth_token)):
    """
    Test Endpoint to validate user identity.
    """
    return {"email": email}


@app.post("/pixel/{row}/{col}/{color}")
async def pixel(row: int, col: int, color: int, response: Response, email: str = Depends(verify_auth_token)):
    global insertion_lock, current_grid, latest_insertion

    if not are_bounds_valid(row, col) or not is_color_valid(color):
        response.status_code = 400
        return {"message": "Invalid pixel coordinates or color."}

    cooldown = get_user_cooldown(email)
    if (cooldown > 0):
        response.status_code = 429
        return {"message": "You are on cooldown.", "cooldown": cooldown}

    insertion_lock.acquire()
    latest_insertion = int(queries.log_update(conn, x=row, y=col, color=color, email=email))
    current_grid[row][col] = color
    print(latest_insertion)
    insertion_lock.release()

    return {"message": "Pixel updated successfully."}


@app.get("/full_grid")
def full_grid():
    """
    Return the full grid and the latest insertion id.
    """
    global current_grid, latest_insertion

    return {"grid": current_grid, "last update": latest_insertion}


@app.get("/updates/{last_updated}")
def updates(last_updated: int):
    """
    Return the updates since the last update.
    """
    global current_grid, latest_insertion

    updates = []
    for x, y, color in queries.get_updates(conn, last_updated=last_updated):
        updates.append({"row": x, "col": y, "color": color})

    return {"updates": updates, "last update": latest_insertion}


@app.get("/cooldown")
async def cooldown(email: str = Depends(verify_auth_token)):
    """
    Return the cooldown time.
    """
    return get_user_cooldown(email)


@app.get("/pixel/{row}/{col}/history")
async def pixel_history(row: int, col: int):
    """
    Return the history of a pixel (last 5 updates).
    """
    if not are_bounds_valid(row, col):
        raise HTTPException(
            status_code=400, detail="Invalid pixel coordinates."
        )
    result = queries.get_pixel_history(conn, x=row, y=col)

    # parse this list of tuples into a list of dicts
    res_final = []
    for row in result:
        name = queries.get_name(conn, email=row[0])[0]
        res_final.append({"email": row[0], "timestamp": row[1], "color": row[2], "name": name})

    return res_final
