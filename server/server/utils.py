import os
import psycopg2
import aiosql
from dotenv import load_dotenv
from auth import get_user_details
from fastapi import Header, HTTPException
from google.auth import exceptions
load_dotenv()

DATABASE = os.getenv("DATABASE")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASS = os.getenv("POSTGRES_PASS")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")

grid_queries = aiosql.from_path("./queries/grid.sql", "psycopg2")
hostel_queries = aiosql.from_path("./queries/hostel.sql", "psycopg2")
common_queries = aiosql.from_path("./queries/common.sql", "psycopg2")

conn = psycopg2.connect(
    database=DATABASE,
    user=POSTGRES_USER,
    password=POSTGRES_PASS,
    host=POSTGRES_HOST,
    port=POSTGRES_PORT,
)
conn.autocommit = True
print("Opened database successfully!")


def try_details(Authorization: str = Header()):
    try:
        details = get_user_details(Authorization)
        if details is None:
            raise HTTPException(
                status_code=401, detail="We are not able to authenticate you."
            )
        
        GSUITE_DOMAIN_NAME = "iith.ac.in"
        domain = details[0].split("@")[-1]

        if domain != GSUITE_DOMAIN_NAME and not domain.endswith("." + GSUITE_DOMAIN_NAME):
            raise HTTPException(
                status_code=498, detail="Only IITH users are allowed."
            )

    except exceptions.InvalidValue:
        raise HTTPException(
            status_code=498, detail="Invalid Token, please login again."
        )
    return details


def verify_auth_token(Authorization: str = Header()):
    email, _ = try_details(Authorization)
    return email


# Same as verify_auth_token but creates a new user in the DB if the user does not exist
def verify_auth_token_with_create(Authorization: str = Header()):
    email, name = try_details(Authorization)
    common_queries.create_user(conn, name=name, email=email)
    return email
