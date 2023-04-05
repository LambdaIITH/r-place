import os
from typing import Union

import psycopg2
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException
from psycopg2.extras import Json, RealDictCursor
import aiosql

from auth import get_user_email

load_dotenv()

DATABASE = os.getenv("DATABASE")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASS = os.getenv("POSTGRES_PASS")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")

app = FastAPI()

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
# initialize the in-mem grid
for x, y, color in queries.get_full_grid(conn):
    print(x, y, color)
    current_grid[x][y] = color


def verify_auth_token(Authorization: str = Header()):
    email = get_user_email(Authorization)
    if email is None:
        raise HTTPException(
            status_code=401, detail="We are not able to authenticate you."
        )
    return email


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/auth")
async def auth(email: str = Depends(verify_auth_token)):
    """
    Test Endpoint to validate user identity.
    """
    return {"email": email}


@app.get("/full_grid")
def full_grid():
    """
    Return the full grid.
    """
    return current_grid
