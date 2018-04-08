DROP TABLE IF EXISTS users, tasks, bids;

CREATE TYPE STATE AS ENUM ('bidding','awarded', 'unfulfilled', 'complete');

CREATE TABLE users
(
  username VARCHAR(100) PRIMARY KEY,
  password VARCHAR(32) NOT NULL, -- MD5 hash of the password
  name VARCHAR(100) NOT NULL,
  admin boolean DEFAULT FALSE NOT NULL -- indicates if the user is an admin
);

CREATE UNIQUE INDEX upper_index
  ON users (upper(username :: TEXT)); -- Enforces all usernames are case insensitively unique

CREATE TABLE tasks
(
  id SERIAL PRIMARY KEY, -- Auto incrementing unique ID for each task
  startBid REAL NOT NULL, -- Price which bidding starts
  currentBid REAL, -- Current lowest bid on task (Null indicates no bid was placed)
  acceptBid REAL DEFAULT 0 NOT NULL, -- If the bid drops to this price, then the task is awarded
  acceptTime TIMESTAMP, -- Optional time to end the bid
  taskStartTime TIMESTAMP DEFAULT '-infinity' NOT NULL,
  taskEndTime TIMESTAMP NOT NULL,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(999),
  requester VARCHAR(100) NOT NULL,
  awardedTo VARCHAR(100),
  state STATE DEFAULT 'bidding',
  FOREIGN KEY (requester) REFERENCES users(username)
    ON DELETE CASCADE,
  FOREIGN KEY (awardedTo) REFERENCES users(username)
    ON DELETE CASCADE,
  CHECK (startBid > currentBid),
  CHECK (currentBid >= acceptBid),
  CHECK (acceptTime <= taskEndTime),
  CHECK (taskEndTime > taskStartTime)
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
