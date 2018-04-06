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
  bid REAL NOT NULL,
  task_id SERIAL,
  username VARCHAR(100),
  FOREIGN KEY (task_id) REFERENCES tasks(id)
    ON DELETE CASCADE,
  FOREIGN KEY (username) REFERENCES users(username)
    ON DELETE CASCADE,
  PRIMARY KEY(task_id, username)
);

DROP FUNCTION IF EXISTS update_tasks_table(); -- drop it
CREATE OR REPLACE FUNCTION update_tasks_table() RETURNS TRIGGER AS $func$
BEGIN
  UPDATE tasks SET currentBid = NEW.bid
  WHERE id = NEW.task_id AND (currentBid IS NULL OR currentBid > NEW.bid);
  RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS update_tasks_table_on_delete(); -- drop it
CREATE OR REPLACE FUNCTION update_tasks_table_on_delete() RETURNS TRIGGER AS $func2$
BEGIN
  UPDATE tasks SET currentBid = (SELECT MIN(bid) FROM bids WHERE task_id = OLD.task_id)
  WHERE id = OLD.task_id;
  RETURN OLD;
END;
$func2$ LANGUAGE plpgsql;

CREATE TRIGGER bids_insert_or_update_trigger
  AFTER INSERT OR UPDATE ON bids
  FOR EACH ROW
  EXECUTE PROCEDURE update_tasks_table();

CREATE TRIGGER update_currentBid_in_bids_on_deletion
  AFTER DELETE ON bids
  FOR EACH ROW
  EXECUTE PROCEDURE update_tasks_table_on_delete();