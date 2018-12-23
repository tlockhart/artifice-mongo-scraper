/*********************************************************************************/
//DATABASE Connection
/*********************************************************************************/
// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
//var mongojs = require("mongojs");
var mongoose = require("mongoose");
//var logger = require("morgan");

var db = require("./models");

// Initialize Express
var app = express();
//Set Port
var PORT = process.env.PORT || 3000;

// Middleware
//app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Routes must be defined here to get body parser to work
require("./routes/htmlRoutes")(app);

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");


// Database configuration
// Save the URL of our database as well as the name of our collection
var databaseUrl = "artifice_db";
var collections = ["articles"];

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/artifice_db", { useNewUrlParser: true });
 
// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port http://localhost:3000/");
});

//MUST EXPORT APP FOR REQ.BODY TO WORK
module.exports = app;