const express = require('express');
const mysql = require('mysql');
const nodemon = require('nodemon');
const app = express();
const port = 3000;
app.use(express.json());

const connection = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"password",
  database:"mini_projeto"
});

// PARTE A

// ============================================================================================================== (a)

app.get("/products-list", (req, res) =>{
  connection.query("SELECT id, name FROM products", function(error, results, fields){
    if (error) {
      res.status(500).send("Server error");
      throw error;
    };
    if (results.length == 0){
      res.status(404).send("No products found.");
    };
    res.send(results);
  });
});

// Example: localhost:3000/products-list

// ============================================================================================================== (b)

app.post("/products-new", (req, res) =>{
  connection.query("SELECT MAX(id) as max_id, CURRENT_DATE() as date, CURRENT_TIME as time FROM products", function(error, results, fields){
    if (error) {
      res.status(500).send("Server error");
      throw error;
    };
    var max_id = results[0].max_id;
    var new_id = max_id + 1;
    var date = results[0].date;
    var time = results[0].time;
    var data = [
      new_id,
      'Teclado mecânico',
      '314236377956',
      'Eletrónicos',
      4,
      'Teclado gaming com anti-ghosting e rapid trigger',
      650,
      80,
      date,
      time,
      '{"user": "Ana", "comment": "Produto excelente!"}',
      'in stock',
      15,
      'TechSupplier'
    ];
    connection.query("INSERT INTO products (id, name, barcode, department, review, description, weight, price, date, created, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", data,
      function(error, results, fields){
        if (error) {
          res.status(500).send("Server error");
          throw error;
        }
        res.send(`Produto inserido, id do produto: ${new_id}`)
      });
  });
});

// Example: localhost:3000/products-new

// ============================================================================================================== (c)

app.get("/products/:department", (req, res) =>{
  var department = req.params.department;
  connection.query("SELECT name FROM products WHERE department = ?", department, function(error, results, fields){
    if (error){
      res.status(500).send("Server error");
      throw error;
    };
    res.send(results);
  });
});

// Example: localhost:3000/products/eletronicos

// ============================================================================================================== (d)

app.patch("/products-discount", (req, res) =>{
  var name = req.query.name;
  var discount = req.query.discount / 100;
  connection.query("SELECT price FROM products WHERE name = ?", name, function(error, results, fields){
    if (error){
      res.status(500).send("Server error");
      throw error;
    };
    if (results.length == 0){
      res.status(404).send("Product wasn't found.");
    };
    var final_price = results[0].price - (results[0].price * discount)
    var params = [final_price, name]
    connection.query("UPDATE products SET price = ? WHERE name = ?", params, function(error, results, fields){
      if (error){
        res.status(500).send("Server error");
        throw error;
      };
      connection.query("SELECT name, price FROM products WHERE name = ?", name, function(error, results, fields){
        if (error){
          res.status(500).send("Server error");
          throw error;
        };
        if (results.length == 0){
          res.status(404).send("Price not updated, try again.");
        };
        res.send("Price updated with sucess!")
      });
    });
  });
});

// Example: localhost:3000/products?name=iphone&discount=20

// ============================================================================================================== (e)

app.get("/products-date/:date", (req, res) =>{
  var date = req.params.date;
  connection.query("SELECT id, name, date FROM products WHERE date < ?", date, function(error, results, fields){
    if (error){
      res.status(500).send("Server error");
      throw error;
    };
    if (results.length == 0){
      res.status(404).send("Products created before this date weren't found.");
    };
    res.send(results);
  });
});

// Example: localhost:3000/products/2025-03-16

// ==============================================================================================================

// PARTE B

// ============================================================================================================== (a)

app.get("/products-id/:id", (req, res) => {
  const id = req.params.id;
  try {
    connection.query("SELECT * FROM products WHERE id=?", [id], (err, rows) => {
      if (rows.length === 0) {
        return res.status(404).json({ message: "Product with id " + id + " not found!!" });
      }
      const product = rows[0];
      res.status(200).json({
        id: product.id,
        name: product.name,
        barcode: product.barcode,
        department: product.department,
        description: product.description,
        review: product.review,
        weight: product.weight,
        price: product.price,
        comment: product.comment,
      });
    });
  } catch (err) {
    res.status(500).json({ message: "Erro no server!!!" });
  }
});

// ============================================================================================================== (b)

app.delete('/products/:id', (req, res) =>{
  const id = req.params.id;
  try {
    connection.query("SELECT * FROM products WHERE id=?", [id], (err, rows) => {
      if (!(rows.length === 0)) { 
        try {
          connection.query("DELETE FROM products WHERE id=?", [id], (err, rows) => {
            res.status(200).json({ message: "Product with id " + id + " was deleted!!" });
          });
        } catch (err) {
          res.status(500).json({ message: "Erro no server!!!" });
        }
      }else{
        return res.status(404).json({ message: "Product with id " + id + " not found!!" });
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Erro no server!!!" });
  }
});

// ============================================================================================================== (c)

app.post('/products-search', (req, res) => {
  const keyWord = req.body.word;
  var guardarId = [];
  try {
      connection.query("SELECT id, description FROM products", (err, results) => {
          if (err) {
              return res.status(500).json({ message: "Error retrieving products." });
          }
          for (let index = 0; index < results.length; index++) {
              var element = results[index].description.toLowerCase();
              console.log(element);
              if (element.includes(keyWord.toLowerCase())) { 
                  guardarId.push(results[index].id);
              }
          }
          const placeholders = guardarId.map(() => '?').join(',');

          connection.query(`SELECT * FROM products WHERE id IN (${placeholders})`, guardarId, (err, result) => {
              if (err) {
                  return res.status(500).json({ message: "Error retrieving products by ID." });
              }
              res.send(result);
              console.log(result);
          });
      });
  } catch (err) {
      res.status(500).json({ message: "Error in server!!!" });
  }
});

// ============================================================================================================== (d)

app.patch("/products-comment/:id", (req, res) =>{
  var id = req.params.id
  connection.query("SELECT id, name, comment FROM products WHERE id = ?", id, function(error, results, fields){
    if (error){
      res.status(500).send("Server error");
      throw error;
    };
    if (results.length == 0){
      res.status(404).send("Product wasn't found.");
    };
    var user = "Maria"
    var comment = "Nada a apontar"
    var new_comment_obj = {
      user: user,
      comment: comment
    }
    var new_comment = `{"user":"${new_comment_obj.user}", "comment":"${new_comment_obj.comment}"}`
    var all_comment = results[0].comment + "," + new_comment
    var data = [all_comment, id]
    connection.query("UPDATE products SET comment = ? WHERE id = ?", data, function(error, results, fields){
      if (error){
        res.status(500).send("Server error");
        throw error;
      };
      if (results.length == 0){
        res.status(404).send("Product comments weren't updated, try again.");
      };
      connection.query("SELECT id, name, comment FROM products WHERE id = ?", id, function(error, results, fields){
        if (error){
          res.status(500).send("Server error");
          throw error;
        };
        if (results.length == 0){
          res.status(404).send("Product wasn't found.");
        };
        res.send(results);
      });
    });
  });
});

// Example: localhost:3000/products/1

// ============================================================================================================== (e)

app.get("/products-ascending", (req, res) =>{
  connection.query("SELECT id, name, price FROM products", function(error, results, fields){
    if (error){
      res.status(500).send("Server error");
      throw error;
    };
    if (results.length == 0){
      res.status(404).send("Products not found.");
    };
    results.sort((a,b) => a.price - b.price);
    res.send(results);
  });
});

// ==============================================================================================================

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

