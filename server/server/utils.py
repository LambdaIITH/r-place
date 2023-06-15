import os
import psycopg2
import aiosql
from dotenv import load_dotenv
from auth import get_user_email
from fastapi import Header, HTTPException

load_dotenv()

DATABASE = os.getenv("DATABASE")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASS = os.getenv("POSTGRES_PASS")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")

grid_queries = aiosql.from_path("./queries/grid.sql", "psycopg2")
hostel_queries = aiosql.from_path("./queries/hostel.sql", "psycopg2")

conn = psycopg2.connect(
    database=DATABASE,
    user=POSTGRES_USER,
    password=POSTGRES_PASS,
    host=POSTGRES_HOST,
    port=POSTGRES_PORT,
)
conn.autocommit = True
print("Opened database successfully!")


def verify_auth_token(Authorization: str = Header()):
    email = get_user_email(Authorization)
    if email is None:
        raise HTTPException(
            status_code=401, detail="We are not able to authenticate you."
        )
    return email
