
//express app
const express = require("express");
const app = express();
process.on('uncaughtException', function (err) {
    console.log(err);
  });
  

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("upload"));
const cors = require("cors");
app.use(cors());

//modules
const auth = require("./routes/Auth");
const books = require("./routes/books");
const readers = require("./routes/readers");

//server
app.listen(4000,"localhost",()=>{
    console.log("server is running");
});


//API 
app.use("/auth",auth);
app.use("/books",books);
app.use("/readers",readers);



