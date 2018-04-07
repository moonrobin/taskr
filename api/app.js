var express = require('express');
var app = express();
var cors = require('cors');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

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
  WHERE id = $1 AND currentbid != NULL AND currentbid < $2
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
app.post('/createtask/:title/:acceptbid/:taskendtime', function(req, res){
  values = [
    req.params.acceptbid,
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
  INSERT INTO tasks (acceptBid, acceptTime, taskEndTime, title, description, requester, taskstartTime) 
  VALUES ($1, $2, $3, $4, $5, $6, $7)`:
  `
  INSERT INTO tasks (acceptBid, acceptTime, taskEndTime, title, description, requester) 
  VALUES ($1, $2, $3, $4, $5, $6)
  `;
  console.log(queryText)
  client.query(queryText, values, (err, result) => {
    if (err) {
      console.log(err.stack);
      res.sendStatus(400);
    } else {
      console.log(`${req.session.user} has created task: ${req.query.title} with startbid $${req.query.acceptbid}`);
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
