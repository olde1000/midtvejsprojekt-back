const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());

//Host, user, password database
const connection = mysql.createConnection({
    //process.env.KEYWORD
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE
});

app.get("/hello", () => {
    console.log("Hello");
});

app.get('/',(req, res) => {
    connection.query('SELECT name FROM pokemon',(error,results) => {
        res.send(results);
    });
});


//Unsafe way - will allow SQL injections
app.get('/single',(req, res)=>{
    const requestParameter = req.query.name; // "Charizard"

    connection.query('SELECT * FROM pokemon WHERE name ="' + requestParameter + "\"",(error,results) => {
        res.send(results);
    });
});

//Safe way - will not allow SQL injections
app.get('/single-safe', (req, res) => {
    const requestParameter = req.query.name;

    connection.query(
        'SELECT * FROM pokemon WHERE name = ?',
        [requestParameter],
        (error, results) => {
            res.send(results);
        }
    );
});

app.listen(port, () =>{
    console.log(`Application is now running on port ${port}`);
});