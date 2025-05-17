CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE,
    password VARCHAR,
    emailVerified BOOLEAN DEFAULT FALSE,
    activationLink VARCHAR
);

CREATE TABLE tokens(
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    refreshToken VARCHAR,
    ip VARCHAR,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

SELECT * FROM users;

SELECT * FROM tokens;