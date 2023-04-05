-- name: get_full_grid
-- Get full grid from database
SELECT DISTINCT ON (x, y)
  x, y, color FROM pixel_logs
  ORDER BY x, y, id DESC;

-- name: get_updates
-- Get updates with id > :id
SELECT DISTINCT ON (x, y)
  x, y, color FROM pixel_logs
  WHERE id > :id
  ORDER BY x, y, id DESC;

-- name: log_update
-- Log a pixel update
INSERT INTO pixel_logs (x, y, color, email) VALUES (:x, :y, :color, :email) RETURNING id;

-- name: get_last_update_by_user^
SELECT MAX(extract(epoch from time_stamp)) as last_time FROM pixel_logs WHERE email = :email;