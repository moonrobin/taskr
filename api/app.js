var express = require('express');
var app = express();
var cors = require('cors');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var cron = require('node-cron');

app.use(cors({credentials: true, origin: 'http://localhost:1234'}));
app.use(cookieSession({
  name: 'session',
  secret: 'secret'
}));

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user){
    return next();
  } else {
    // Forbidden access
    console.log('forbidden access: ' + JSON.stringify(req.session));
    return res.sendStatus(401);
  }
}

const { Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'taskrdb',
  password: 'kappa123',
  port: 5432,
})

client.connect();
app.listen(3000);
console.log('Now listening for requests on port 3000...');

// cron schedules a task to check the database every minute to update tasks table
cron.schedule('* * * * *', function(){
  // Send a query that updates tasks with no bids to 'unfulfilled'
  var unfulfilledQuery = `
  UPDATE tasks
  SET state = 'unfulfilled'
  WHERE state = 'bidding' AND NOT EXISTS (SELECT * FROM bids WHERE task_id = id) AND LOCALTIMESTAMP(0) >= acceptTime;
  `
  client.query(unfulfilledQuery, (err, result) => {
    if (err) {
      console.log(err.stack);
    } else {
    console.log("succeeded in updating bidding tasks to unfulfilled tasks");
    }
  });
  //Send a query that updates tasks with bids to 'awarded' and award to the bidder
  var awardedQuery = `
  UPDATE tasks
  SET state = 'awarded', awardedto = (SELECT username FROM bids WHERE task_id = id AND bid = currentBid LIMIT 1)
  WHERE state = 'bidding' AND EXISTS (SELECT * FROM bids WHERE task_id = id) AND (LOCALTIMESTAMP(0) >= acceptTime OR currentBid <= acceptBid);
  `
  client.query(awardedQuery, (err, result) => {
    if (err) {
      console.log(err.stack);
    } else {
    console.log("succeeded in updating bidding tasks to awarded tasks");
    }
  });
  //Send a query that sets 'awarded' tasks to 'completed' if they have passed their taskEndTime
  var completedQuery = `
  UPDATE tasks
  SET state = 'complete'
  WHERE state = 'awarded' AND LOCALTIMESTAMP(0) >= taskEndTime;
  `
  client.query(completedQuery, (err, result) => {
    if (err) {
      console.log(err.stack);
    } else {
    console.log("succeeded in updating awarded tasks to completed tasks");
    }
  });
});

// Login Endpoint
app.get('/login/:username/:password', function(req, res){

  var queryText = `
  SELECT username 
  FROM users 
  WHERE username = $1 
  AND password = MD5($2)
  `;

  values = [req.params.username, req.params.password];

  client.query(queryText, values, (err, result) => {
    if (err) {
      console.log(err.stack);
    } else {
      if (result.rows[0]) {
        req.session.user = result.rows[0].username;  
        console.log( 'Logged in as user ' + req.session.user );
        res.sendStatus(200);
      } else {
        console.log('No such user found');
        res.sendStatus(401);
      } 
    }
  });
});

// Logout endpoint
app.get('/logout', auth, function (req, res) {
  console.log( 'Logged out as user: ' + req.session.user );
  req.session = null;
  res.sendStatus(200); // replace with static page/redirect

});

// Sign-up endpoint
app.post('/createuser/:username/:password/:name', function(req, res){
  var queryText = `INSERT INTO users VALUES($1, MD5($2), $3)`;
  values = [req.params.username, req.params.password, req.params.name];
  client.query(queryText, values, (err, result) => {
    if (err) {
      console.log(err.stack);
      res.sendStatus(400);
    } else {
      console.log(`Successfully added user: ${req.params.username} into database`);
      res.sendStatus(201);
    }
  });
});

// for future content api calls
app.get('/content', auth, function (req, res) {
  // later we will read req.session.user and use it for our queries to DB
  res.send('User will be able to see this only after they login');
});

// tasks endpoint
app.get('/tasks', function(req, res){ // TODO: add auth back in
  var values;
  var queryText;
  
  if (req.query.requester) {
    values = [req.session.user];
    queryText = `
    SELECT *
    FROM tasks
    WHERE requester = $1
    `;
  } else if (req.query.bidder) {
    values = [req.session.user];
    queryText = `
    SELECT *
    FROM tasks
    WHERE id IN ( SELECT task_id FROM
    bids WHERE username = $1)
    `;
  } else if (req.query.taskid) {
    values = [req.query.taskid];
    queryText = `
    SELECT *
    FROM tasks
    WHERE id = $1
    `;
  } else if (Object.keys(req.query).length != 0){
    var taskStartTime = req.query.taskstarttime || '-infinity';
    var taskEndTime = req.query.taskendtime || 'infinity';
    var titleQuery = req.query.titlequery || '';
    values = [taskStartTime, taskEndTime, titleQuery];
    queryText = `
    SELECT *
    FROM tasks t
    WHERE t.taskStartTime >= $1
    AND t.taskEndTIme <= $2
    AND t.title ILIKE '%' || $3 || '%'
    `;
  } else {
    queryText = `
    SELECT *
    FROM tasks
    `;
  }

  client.query(queryText, values, (err, result) => {
    if (err) {
      console.log(err.stack);
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result.rows));
    }
  });
});

// Bid endpoint
app.post('/bid/:task/:bid/', function(req, res){
  var validationValues = [req.params.task, req.params.bid];
  var validationQuery = `
  SELECT 1
  FROM tasks
  WHERE id = $1 AND currentbid IS NOT NULL AND currentbid < $2
  `;


  client.query(validationQuery, validationValues, (err, result) => {
    if (err || result.rows[0]) { // if we get anything back from this, then this bid isn't valid
      console.log('Bid must be lower than current bid');
      res.sendStatus(400);
      return;
    } else {
      values = [req.params.task, req.params.bid, req.session.user];
      var queryText = `
      INSERT INTO bids (task_id, bid, username)
      VALUES ($1, $2, $3) ON CONFLICT (task_id, username) DO UPDATE
      SET bid = $2
      `;
      client.query(queryText, values, (err, result) => {
        if (err) {
          console.log(err.stack);
          res.sendStatus(400);
        } else {
          values = [req.params.task, req.params.bid]
          queryText = `
          UPDATE tasks
          SET currentBid = $2
          WHERE id = $1
          `;

          client.query(queryText, values, (err, result) => {
            if (err) {
              console.log(err.stack);
              res.sendStatus(400);
            } else {
              console.log(`${req.session.user} has bid on ${req.params.task} for $${req.params.bid}`);
              res.sendStatus(200);
            }
          });
        }
      });
    }
  });
});

// createtask endpoint
app.post('/createtask/:title/:startbid/:taskendtime', function(req, res){
  values = [
    req.params.startbid,
    req.query.acceptbid || '0',
    req.query.accepttime,
    req.params.taskendtime,
    req.params.title,
    req.query.description,
    req.session.user
  ];
  if (req.query.taskstarttime) {
    values.push(req.query.taskstarttime);
  }
  // RL:Two queries are a workaround for sanitization 
  var queryText = req.query.taskstarttime ? `
  INSERT INTO tasks (startBid, acceptBid, acceptTime, taskEndTime, title, description, requester, taskstartTime) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`:
  `
  INSERT INTO tasks (startBid, acceptBid, acceptTime, taskEndTime, title, description, requester) 
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;
  console.log(queryText)
  client.query(queryText, values, (err, result) => {
    if (err) {
      console.log(err.stack);
      res.sendStatus(400);
    } else {
      console.log(`${req.session.user} has created task: ${req.params.title} with startbid $${req.params.startbid}`);
      res.sendStatus(200);
    }
  });
});

// updatetask endpoint
app.post('/updatetask/:taskid', function(req, res){
  values = [req.params.taskid];
  var queryText = `
  UPDATE tasks
  SET acceptbid = ${req.query.acceptbid || 'acceptbid'},
  description = ${"'"+req.query.description+"'" || 'description'},
  accepttime = ${"'"+req.query.accepttime+"'" || 'accepttime'}
  WHERE id = $1
  `;
  console.log(queryText)
  client.query(queryText, values, (err, result) => {
    if (err) {
      console.log(err.stack);
      res.sendStatus(400);
    } else {
      console.log(`Task: ${req.params.taskid} has been updated`);
      res.sendStatus(200);
    }
  });
});

// deletetask endpoint
app.delete('/deletetask/:taskid', function(req, res){
  var values = [req.params.taskid];
  var queryText = `
  DELETE FROM tasks
  where id = $1
  `;
  client.query(queryText, values, (err, result) => {
    if (err) {
      console.log(err.stack);
      res.sendStatus(400);
    } else {
      console.log(`task: ${req.params.taskid} has been deleted`);
      res.sendStatus(200);
    }
  });
});
