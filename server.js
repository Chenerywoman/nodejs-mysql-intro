const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();

const db = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "root",
    port: 8889,
    database: "users_db"
});

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("MySQL connected")
    }
});

// to enable to pass data from frontend to backend
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const viewsPath = path.join(__dirname, '/views');
app.set('view engine', 'hbs');
app.set('views', viewsPath);

app.get("/", (req, res) => {
    db.query('SELECT * FROM users', (error, results) => {
        console.log(results);
        res.render("index", {
            users: results
        });
    });
  
    // res.send("My Nodejs and MySql intro");
});

app.get("/register", (req, res) => {

    // e.g. info coming from a form
    let name = "Kyle";
    let age = 18; 
    let city = "Manchester";

    db.query('INSERT INTO users SET ?', {first_name: name, age: age, city: city}, (error, results) => {
        if (error) {
            res.send('There was an error');
        } else {
            res.send("User has been registered");
        }
    });
});

app.get("/update", (req, res) => {
    res.render("update")
});

app.post("/update/:userId", (req, res) => {

    const name = req.body.userName;
    const age = req.body.userAge;
    const city = req.body.userCity;

    const id = req.params.userId;
    console.log(id)
    const query = 'UPDATE users SET first_name = ?, age = ?, city = ? WHERE id = ?';

    let user = [name, age, city, id];

    db.query(query, user, (err, result) => {
        if (err){
            res.send("there was an error")
        } else {
            res.send("user has been updated.")
        }
    });
});

app.listen(5000, () => {
    console.log("server started on port 5000")
});