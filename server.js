const express = require('express');
const mysql = require('mysql');
const nodemon = require('nodemon');
const app = express();
const port = 3001;

const connection = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"password",
  database:"mini_projeto",
})

app.get('/test', (req, res) =>{
  res.send('It is Working!');
});

// PARTE A

app.get("/users", (req, res) =>{
  connection.query("", (err, results, fields){
    if (err){
      console.log(err);
    }
    else{
      res.send(results);
    }
  })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

