import os
import time
from typing import Union

import psycopg2
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException
from psycopg2.extras import Json, RealDictCursor
from pydantic import BaseModel
from threading import Lock
import aiosql
import json

from auth import get_user_email

load_dotenv()

COLS = 100
ROWS = 100
COLORS = 32
COOLDOWN_TIME = 600 # in seconds

DATABASE = os.getenv("DATABASE")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASS = os.getenv("POSTGRES_PASS")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")


app = FastAPI()
queries = aiosql.from_path("./queries.sql", "psycopg2")

conn = psycopg2.connect(
    database=DATABASE,
    user=POSTGRES_USER,
    password=POSTGRES_PASS,
    host=POSTGRES_HOST,
    port=POSTGRES_PORT,
)
print("Opened database successfully!")

queries = aiosql.from_path("queries.sql", "psycopg2")

ROWS = 100
COLUMNS = 100
COLORS = 32

INITIAL_COLOR = 0

current_grid = [[INITIAL_COLOR for _ in range(COLUMNS)] for _ in range(ROWS)]
latest_insertion = int(queries.get_last_update(conn)[0])

insertion_lock = Lock()

# initialize the in-mem grid
for x, y, color in queries.get_full_grid(conn):
    current_grid[x][y] = color

def verify_auth_token(Authorization: str = Header()):
    email = get_user_email(Authorization)
    if email is None:
        raise HTTPException(
            status_code=401, detail="We are not able to authenticate you."
        )
    return email

def get_user_cooldown(email: str):
    prev_req_time = queries.get_last_update_by_user(conn, email=email)[0] 
    if prev_req_time is None:
        return 600
    return (float(time.time()) - float(prev_req_time)) 

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/auth")
async def auth(email: str = Depends(verify_auth_token)):
    """
    Test Endpoint to validate user identity.
    """
    return {"email": email}

@app.post("/pixel/{row}/{col}/{color}}")
async def pixel(x: int, y: int, color: int, email: str = Depends(verify_auth_token)):
    global insertion_lock, current_grid, latest_insertion

    if (x < 0 or x >= ROWS or y < 0 or y >= COLS or color < 0 or color >= COLORS):
        raise HTTPException(
            status_code=400, detail="Invalid pixel coordinates or color."
        )

    if (get_user_cooldown(email)<COOLDOWN_TIME):
        raise HTTPException(
            status_code=429, detail="You are on cooldown."
        )
    

    insertion_lock.acquire()
    current_grid[x][y] = color
    latest_insertion = int(queries.log_update(conn, email, x, y, color)[0])
    insertion_lock.release()

    raise HTTPException(
        status_code=200, detail="Pixel updated."
    )

@app.get("/full_grid")
def full_grid():
    """
    Return the full grid and the latest insertion id.
    """
    global current_grid, latest_insertion
    
    return {"grid" : current_grid, "last update" : latest_insertion}

@app.get("/cooldown")
async def cooldown(email: str = Depends(verify_auth_token)):
    """
    Return the cooldown time.
    """
    return get_user_cooldown(email)

@app.get("/pixel/{row}/{col}/history")
async def pixel_history(x: int, y: int, email: str = Depends(verify_auth_token)):
    """
    Return the history of a pixel (last 5 updates).
    """
    if (x < 0 or x >= ROWS or y < 0 or y >= COLS):
        raise HTTPException(
            status_code=400, detail="Invalid pixel coordinates."
        )
    result = queries.get_pixel_history(conn, x, y)
    # parse this to a list of tuples into a list of dicts
    res_final = []
    for row in result:
        res_final.append({"email": row[0], "timestamp": row[1], "color": row[2]})

    return res_final

