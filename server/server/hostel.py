from utils import hostel_queries, conn, verify_auth_token
from typing import Annotated
from fastapi import FastAPI, HTTPException, Response, Body, Depends

hostel_app = FastAPI()
print("Initialized hostel.")


def verify_room(hostel, floor, room=None):
    err = None
    if len(hostel) != 1 or ord(hostel) not in range(ord("A"), ord("J") + 1):
        err = "Invalid hostel"
    if floor not in range(1, 10 + 1):
        err = "Invalid floor"
    if room is not None and room not in range(1, 32 + 1):
        err = "Invalid room"
    if err is not None:
        print(err)
        raise HTTPException(status_code=400, detail=err)
    return None


@hostel_app.get("/search/name")
def search_by_name(q: str):
    # q is query param
    results = hostel_queries.search_by_name(conn, prefix=q)
    res = []
    for hostel, floor, room, name, email in results:
        res.append(
            {
                "hostel": hostel,
                "floor": floor,
                "room_number": room,
                "name": name,
                "email": email,
            }
        )

    return res


@hostel_app.get("/{hostel_name}/{floor}")
def get_floor(hostel_name: str, floor: int, response: Response):
    verify_room(hostel_name, floor)

    floor_data = hostel_queries.get_floor(conn, hostel=hostel_name, floor=floor)
    res = []
    for name, quote, room, email in floor_data:
        res.append({"name": name, "quote": quote, "room_number": room, "email": email})
    return res


@hostel_app.get("/{hostel_name}/{floor}/{room}")
def get_room(hostel_name: str, floor: int, room: int,
        email: str = Depends(verify_auth_token)):
    verify_room(hostel_name, floor, room)

    room_data = hostel_queries.get_room(
        conn, hostel=hostel_name, floor=floor, room=room
    )
    if room_data is None:
        raise HTTPException(status_code=404, detail="Room not found")

    name, form_response, email, quote = room_data
    return {"name": name, "form_response": form_response, "email": email, "quote": quote}


@hostel_app.get("/{hostel_name}/{floor}/{room}/owner")
def get_owner(hostel_name: str, floor: int, room: int):
    verify_room(hostel_name, floor, room)

    owner = hostel_queries.get_owner(conn, hostel=hostel_name, floor=floor, room=room)
    if owner is None:
        raise HTTPException(status_code=404, detail="Room not found")

    name, email = owner
    return [
        {
            "name": name,
            "email": email,
            "hostel": hostel_name,
            "floor": floor,
            "room_number": room,
        }
    ]


@hostel_app.get("/{hostel_name}/{floor}/{room}/comments")
def get_comments(hostel_name: str, floor: int, room: int,
        email: str = Depends(verify_auth_token)
        ):
    verify_room(hostel_name, floor, room)
    owner = hostel_queries.get_owner(conn, hostel=hostel_name, floor=floor, room=room)
    if owner is None:
        raise HTTPException(status_code=404, detail="Room not found")

    owner_name, owner_email = owner
    if owner_email != email:
        comments = hostel_queries.get_comment(
            conn, from_user=email, to_user=owner_email
        )
    else:
        comments = hostel_queries.get_owner_comments(conn, to_user=owner_email)
    res = []
    print(comments)
    print(owner_email)
    for from_user, to_user, comment in comments:
        res.append({"from_user": from_user, "to_user": to_user, "comment": comment})

    return res


@hostel_app.post("/{hostel_name}/{floor}/{room}/comments")
def add_comment(
    hostel_name: str,
    floor: int,
    room: int,
    comment: Annotated[str, Body(max_length=1024, embed=True)],
    email: str = Depends(verify_auth_token)
):
    verify_room(hostel_name, floor, room)

    owner = hostel_queries.get_owner(conn, hostel=hostel_name, floor=floor, room=room)
    if owner is None:
        raise HTTPException(status_code=404, detail="Room not found")
    owner_name, owner_email = owner

    if owner_email == email:
        raise HTTPException(status_code=400, detail="Cannot add comments on own room")
    try:
        hostel_queries.insert_comment(
            conn, from_user=email, to_user=owner_email, comment=comment
        )
        conn.commit()
    except Exception as err:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(err))
    return {"status": "ok"}


@hostel_app.patch("/{hostel_name}/{floor}/{room}/comments")
def update_comment(
    hostel_name: str,
    floor: int,
    room: int,
    comment: Annotated[str, Body(max_length=1024, embed=True)],
    email: str = Depends(verify_auth_token)
):
    verify_room(hostel_name, floor, room)

    owner = hostel_queries.get_owner(conn, hostel=hostel_name, floor=floor, room=room)
    if owner is None:
        raise HTTPException(status_code=404, detail="Room not found")

    owner_name, owner_email = owner
    if owner_email == email:
        raise HTTPException(
            status_code=400, detail="Cannot update comments on own room"
        )
    try:
        hostel_queries.update_comment(
            conn, from_user=email, to_user=owner_email, comment=comment
        )
        conn.commit()
    except Exception as err:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(err))
    return {"status": "ok"}


@hostel_app.delete("/{hostel_name}/{floor}/{room}/comments")
def delete_comment(hostel_name: str, floor: int, room: int, email: str = Depends(verify_auth_token)):
    verify_room(hostel_name, floor, room)

    owner = hostel_queries.get_owner(conn, hostel=hostel_name, floor=floor, room=room)
    if owner is None:
        raise HTTPException(status_code=404, detail="Room not found")

    owner_name, owner_email = owner
    if owner_email == email:
        raise HTTPException(
            status_code=400, detail="Cannot delete comments on own room"
        )

    try:
        hostel_queries.delete_comment(conn, from_user=email, to_user=owner_email)
        conn.commit()
    except Exception as err:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(err))

    return {"status": "ok"}
