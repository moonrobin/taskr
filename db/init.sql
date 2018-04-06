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
  currentBid REAL,
  acceptBid REAL DEFAULT 0,
  acceptTime TIMESTAMP,
  taskStartTime TIMESTAMP DEFAULT '-infinity',
  taskEndTime TIMESTAMP DEFAULT 'infinity' NOT NULL,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(999) NOT NULL,
  requester VARCHAR(100) NOT NULL,
  FOREIGN KEY (requester) REFERENCES users(username)
    ON DELETE CASCADE
);

CREATE TABLE bids
(
  bid REAL,
  task_id SERIAL PRIMARY KEY,
  username VARCHAR(100),
  FOREIGN KEY (task_id) REFERENCES tasks(id)
    ON DELETE CASCADE,
  FOREIGN KEY (username) REFERENCES users(username)
    ON DELETE CASCADE
);
