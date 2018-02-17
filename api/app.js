var express = require('express');
var app = express();
var cors = require('cors');
app.use(cors({origin: 'http://localhost:1234'}));

const { Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'testdb',
  password: 'kappa123',
  port: 5432,
})

client.connect();
app.listen(3000);
console.log('Now listening for requests on port 3000...');

app.get('/login/:username/:password', function(req, res){

  var text = `SELECT 1 FROM useraccount WHERE username = $1 AND password = MD5($2)`;
  values = [req.params.username, req.params.password];

  client.query(text, values, (err, result) => {
    if (err) {
      console.log(err.stack);
    } else {
      if (result.rows[0]) {
        console.log('User authenticated');
        res.sendStatus(200);
      } else {
        console.log('No such user found');
        res.sendStatus(401);
      }
    }
  });
});

app.post('/createuser/:username/:password', function(req, res){

  var text = `INSERT INTO useraccount VALUES($1, MD5($2))`;
  values = [req.params.username, req.params.password];
  
  client.query(text, values, (err, result) => {
    if (err) {
      console.log(err.stack);
      res.sendStatus(400);
    } else {
      console.log(`Successfully added user: ${req.params.username} into database`);
      res.sendStatus(201);
    }
  });
});
