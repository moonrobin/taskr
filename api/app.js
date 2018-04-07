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

// app.get('/tasks', auth, function(req, res){ 
app.get('/tasks', function(req, res){ // TODO: add auth back in
  var values;
  var queryText;
  
  if (req.query.requester) {
    values = [req.session.user];
    queryText = `
    select *
    from tasks
    where requester = $1
    `;
  } else if (req.query.bidder) {
    values = [req.session.user];
    queryText = `
    select *
    from tasks
    where id in ( select task_id from
    bids where username = $1)
    `;
  } else if (req.query.taskid) {
    values = [req.query.taskid];
    queryText = `
    select *
    from tasks
    where id = $1
    `;
  } else if (Object.keys(req.query).length != 0){
    var taskStartTime = req.query.taskstarttime ? req.query.taskstarttime : '-infinity';
    var taskEndTime = req.query.taskendtime ? req.query.taskendtime : 'infinity';
    var titleQuery = req.query.titlequery ? req.query.titlequery : '';
    values = [taskStartTime, taskEndTime, titleQuery];
    queryText = `
    select *
    from tasks t
    where t.taskStartTime >= $1
    and t.taskEndTIme <= $2
    and t.title ilike '%' || $3 || '%'
    `;
    console.log("Query:" + queryText);
    console.log("Values:" + values);

  } else {
    queryText = `
    select *
    from tasks
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