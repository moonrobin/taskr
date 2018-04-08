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
  state STATE DEFAULT 'bidding' NOT NULL,
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

-- Trigger for checking the validity of task awarding.
-- When the best bid is awarded to a user who has already
-- accepted a task with an overlapping time, invalidate the task (set it to unfulfilled)

DROP FUNCTION IF EXISTS check_task_award_validity();

CREATE OR REPLACE FUNCTION check_task_award_validity() RETURNS TRIGGER AS $func2$
BEGIN
  IF NEW.state = 'awarded' AND NEW.taskstarttime <> '-infinity' THEN
    UPDATE tasks
    SET state = 'unfulfilled', awardedTo = NULL
    WHERE id = NEW.id AND EXISTS (SELECT * FROM tasks AS t2 WHERE t2.awardedTo = NEW.awardedTo AND t2.id <> NEW.id AND t2.taskStartTime <> '-infinity' AND (taskStartTime, taskEndTime) OVERLAPS (t2.taskStartTime, t2.taskEndTime));
  END IF;
  RETURN NEW;
END;
$func2$ LANGUAGE plpgsql;

CREATE TRIGGER task_awarded_trigger
  AFTER UPDATE ON tasks
  FOR EACH ROW
  EXECUTE PROCEDURE update_tasks_table_on_delete();