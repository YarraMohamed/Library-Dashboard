const mysql = require("mysql");

const connection = mysql.createConnection({
    host :"localhost",
    user : "root",
    password : "",
    database : "library",
    port : "3306"
});

connection.connect((err)=>{
    if(err) console.log("error");
    else
    console.log("DB connected");
});

module.exports = connection;