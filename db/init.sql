DROP TABLE IF EXISTS users, tasks, bids;

CREATE TABLE users
(
  username VARCHAR(100) PRIMARY KEY,
  password VARCHAR(32) NOT NULL,
  name VARCHAR(100) NOT NULL
);

CREATE UNIQUE INDEX upper_index
  ON users (upper(username :: TEXT));

CREATE TABLE tasks
(
  id SERIAL PRIMARY KEY,
  currentBid REAL, -- Null value indicates no bid has been placed
  acceptBid REAL DEFAULT 0,
  acceptTime TIMESTAMP,
  taskStartTime TIMESTAMP DEFAULT '-infinity' NOT NULL,
  taskEndTime TIMESTAMP NOT NULL,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(999),
  requester VARCHAR(100) NOT NULL,
  FOREIGN KEY (requester) REFERENCES users(username)
    ON DELETE CASCADE
);

CREATE TABLE bids
(
  bid REAL NOT NULL,
  task_id SERIAL,
  username VARCHAR(100),
  FOREIGN KEY (task_id) REFERENCES tasks(id)
    ON DELETE CASCADE,
  FOREIGN KEY (username) REFERENCES users(username)
    ON DELETE CASCADE,
  PRIMARY KEY (task_id, username)
);
