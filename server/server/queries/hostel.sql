-- name: get_floor
-- returns name, quote, room number and email
SELECT name, quote, room, email
  FROM hostel_rooms JOIN users ON hostel_rooms.user_email = users.email
  WHERE hostel = :hostel AND floor = :floor;

-- name: get_room^
SELECT name, form_response, email, quote
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

-- name: insert_comment!
-- Insert a comment to a particular owner from the given to_user
INSERT INTO user_comments(from_user, to_user, comment) VALUES(:from_user, :to_user, :comment);

-- name: update_comment!
-- Update a particular comment
UPDATE user_comments SET comment = :comment WHERE from_user = :from_user AND to_user = :to_user;

-- name: get_comment
-- Get comment posted by from_user to to_user
SELECT * FROM user_comments WHERE from_user = :from_user AND to_user = :to_user;

-- name: get_owner_comments
-- given user, get all comments posted on user's room
SELECT * FROM user_comments WHERE to_user = :to_user;

-- name: delete_comment!
-- Delete a particular comment
DELETE FROM user_comments WHERE from_user = :from_user AND to_user = :to_user;
