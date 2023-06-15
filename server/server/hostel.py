from utils import hostel_queries, conn
from fastapi import FastAPI, HTTPException, Response

hostel_app = FastAPI()


def verify_room(hostel, floor, room=None):
    if len(hostel) != 1 or ord(hostel) not in range(ord('A'), ord('J') + 1):
        print('a')
        return "Invalid hostel"
    if floor not in range(1, 10 + 1):
        print('b')
        return "Invalid floor"
    if room is not None and room not in range(1, 32 + 1):
        print('c')
        return "Invalid room"
    return None


@hostel_app.get("/search/name")
def search_by_name(q: str):
    # q is query param
    results = hostel_queries.search_by_name(conn, prefix=q)
    res = []
    for hostel, floor, room, name, email in results:
        res.append({
            "hostel": hostel,
            "floor": floor,
            "room_number": room,
            "name": name,
            "email": email
        })
    return res


@hostel_app.get("/{hostel_name}/{floor}")
def get_floor(hostel_name: str, floor: int, response: Response):
    err = verify_room(hostel_name, floor)
    if err is not None:
        raise HTTPException(
            status_code=400, detail=err
        )

    floor_data = hostel_queries.get_floor(conn, hostel=hostel_name, floor=floor)
    res = []
    for name, quote, room, email in floor_data:
        res.append({
            "name": name,
            "quote": quote,
            "room_number": room,
            "email": email
        })
    return res


@hostel_app.get("/{hostel_name}/{floor}/{room}")
def get_room(hostel_name: str, floor: int, room: int):
    err = verify_room(hostel_name, floor, room)
    if err is not None:
        raise HTTPException(
            status_code=400, detail=err
        )

    room_data = hostel_queries.get_room(conn, hostel=hostel_name, floor=floor, room=room)
    if room_data is None:
        raise HTTPException(
            status_code=404, detail="Room not found"
        )

    name, form_response, email = room_data
    return {
        "name": name,
        "form_response": form_response,
        "email": email
    }


@hostel_app.get("/{hostel_name}/{floor}/{room}/owner")
def get_owner(hostel_name: str, floor: int, room: int):
    err = verify_room(hostel_name, floor, room)
    if err is not None:
        raise HTTPException(
            status_code=400, detail=err
        )

    owner = hostel_queries.get_owner(conn, hostel=hostel_name, floor=floor, room=room)
    if owner is None:
        raise HTTPException(
            status_code=404, detail="Room not found"
        )

    name, email = owner
    return {"name": name, "email": email}
