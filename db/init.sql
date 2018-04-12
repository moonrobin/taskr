DROP TABLE IF EXISTS users, tasks, bids;
DROP TYPE IF EXISTS STATE;
DROP FUNCTION IF EXISTS tasks_table_updated_trigger_function();
DROP FUNCTION IF EXISTS tasks_table_created_trigger_function();
DROP TRIGGER IF EXISTS tasks_table_updated_trigger ON tasks;
DROP TRIGGER IF EXISTS tasks_table_created_trigger ON tasks;

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
  startBid DECIMAL(10, 2) NOT NULL, -- Price which bidding starts
  currentBid DECIMAL(10, 2), -- Current lowest bid on task (Null indicates no bid was placed)
  acceptBid DECIMAL(10, 2) DEFAULT 0.00 NOT NULL, -- If the bid drops to this price, then the task is awarded
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
  bid DECIMAL(10, 2) NOT NULL,
  task_id SERIAL,
  username VARCHAR(100),
  FOREIGN KEY (task_id) REFERENCES tasks(id)
    ON DELETE CASCADE,
  FOREIGN KEY (username) REFERENCES users(username)
    ON DELETE CASCADE,
  PRIMARY KEY (task_id, username)
);

-- Function for checking the validity of task awarding.
-- When the best bid is awarded to a user who has already
-- accepted a task with an overlapping time, invalidate the task (set it to unfulfilled)
CREATE OR REPLACE FUNCTION tasks_table_updated_trigger_function() RETURNS TRIGGER AS $func1$
BEGIN
  IF NEW.currentBid <= NEW.acceptBid THEN
    UPDATE tasks
    SET state = 'awarded', awardedto = (SELECT username FROM bids WHERE task_id = id AND bid = currentBid LIMIT 1)
    WHERE state = 'bidding' AND id = NEW.id;
  END IF;
  -- Check the validity of task if it has been awarded
  IF NEW.state = 'awarded' AND NEW.taskstarttime <> '-infinity' THEN
    UPDATE tasks
    SET state = 'unfulfilled', awardedTo = NULL
    WHERE id = NEW.id
    AND EXISTS (
      SELECT 1
      FROM tasks AS t2
      WHERE t2.awardedTo = NEW.awardedTo
      AND t2.id <> NEW.id
      AND t2.taskStartTime <> '-infinity'
      AND (taskStartTime, taskEndTime) OVERLAPS (t2.taskStartTime, t2.taskEndTime)
    );
  END IF;

  RETURN NEW;
END;
$func1$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION tasks_table_created_trigger_function() RETURNS TRIGGER AS $func2$
BEGIN
  -- Check that the dates are all valid
  IF NEW.taskEndTime < LOCALTIMESTAMP(0) THEN
    RAISE EXCEPTION 'taskEndTime cannot be before the current time';
  END IF;
  IF NEW.acceptTime IS NOT NULL THEN
    IF NEW.acceptTime < LOCALTIMESTAMP(0) THEN
      RAISE EXCEPTION 'acceptTime cannot be before the current time';
    END IF;
  END IF;
  -- Task Start Time is default -infinity, we only check it if it's not -infinity
  IF (NEW.taskStartTime <> '-infinity') THEN
    -- Check the task start time (that it is after the current time, and before the task end time
    IF (NEW.taskStartTime < LOCALTIMESTAMP(0) OR NEW.taskStartTime > NEW.taskEndTime) THEN
      RAISE EXCEPTION 'taskStartTime is invalid.';
    END IF;
  END IF;
  RETURN NEW;
END;
$func2$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_table_updated_trigger
  AFTER UPDATE ON tasks
  FOR EACH ROW
  EXECUTE PROCEDURE tasks_table_updated_trigger_function();

CREATE TRIGGER tasks_table_created_trigger
  BEFORE INSERT ON tasks
  FOR EACH ROW
  EXECUTE PROCEDURE tasks_table_created_trigger_function();