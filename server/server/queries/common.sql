-- name: create_user!
-- Create a user if it does not exist
INSERT INTO users (name, email) VALUES (:name, :email) ON CONFLICT DO NOTHING;
