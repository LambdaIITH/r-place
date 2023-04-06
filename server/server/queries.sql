-- name: get_full_grid
-- Get full grid from database
SELECT DISTINCT ON (x, y)
  x, y, color FROM pixel_logs
  ORDER BY x, y, id DESC;

-- name: get_latest_id^
SELECT MAX(id) FROM pixel_logs;

-- name: get_updates
-- Get updates with id > :last_updated
SELECT DISTINCT ON (x, y)
  x, y, color FROM pixel_logs
  WHERE id > :last_updated
  ORDER BY x, y, id DESC;

-- name: log_update
-- Log a pixel update
INSERT INTO pixel_logs (x, y, color, email) VALUES (:x, :y, :color, :email) RETURNING id;

-- name: get_time_of_last_update^
SELECT EXTRACT(epoch from (time_stamp)) as last_time
 FROM pixel_logs 
 WHERE email = :email;

-- name: get_pixel_history
-- Returns user/timestamp/color of latest 5 updates to a pixel
SELECT email, extract(epoch from time_stamp) as time_stamp, color 
 FROM pixel_logs  
 WHERE x = :x AND y = :y
 ORDER BY time_stamp DESC LIMIT 5;
