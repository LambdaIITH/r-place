-- name: get_floor
-- returns name, quote, room number and email
SELECT name, quote, room, email
  FROM hostel_rooms JOIN users ON hostel_rooms.user_email = users.email
  WHERE hostel = :hostel AND floor = :floor;

-- name: get_room^
SELECT name, form_response, email
  FROM hostel_rooms JOIN users ON hostel_rooms.user_email = users.email
  WHERE hostel = :hostel AND floor = :floor AND room = :room;

-- name: search_by_name
-- searches by name prefix
SELECT hostel, floor, room, name, email
  FROM hostel_rooms JOIN users ON hostel_rooms.user_email = users.email
  WHERE LOWER(name) LIKE LOWER(:prefix) || '%%'
  ORDER BY LOWER(name) LIMIT 10;

-- name: get_owner^
-- given room, get owner. Replaces search_by_room
SELECT name, email
  FROM hostel_rooms JOIN users ON hostel_rooms.user_email = users.email
  WHERE hostel = :hostel AND floor = :floor AND room = :room;
