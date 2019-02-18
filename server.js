/*********************************************************************************/
//DATABASE Connection
/*********************************************************************************/
// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
//var logger = require("morgan");

var db = require("./models");

//Initialize Express
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
//mongoose.connect("mongodb://localhost/artifice_db", { useNewUrlParser: true });
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/artifice_db";

mongoose.connect(MONGODB_URI);

// Set the app to listen on port 3000
app.listen(PORT, function() {
  console.log("App running at: http://localhost:3000/");
});

//MUST EXPORT APP FOR REQ.BODY TO WORK
module.exports = app;
//module.exports = moment;