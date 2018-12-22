/*********************************************************************************/
//DATABASE Connection
/*********************************************************************************/
// Dependencies
/*var cheerio = require("cheerio");
var axios = require("axios");*/
var express = require("express");
var exphbs = require("express-handlebars");
//var mongojs = require("mongojs");
var mongoose = require("mongoose");
var logger = require("morgan");

// Initialize Express
var app = express();

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Middleware
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
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

// This makes sure that any errors are logged if mongodb runs into an issue
/*db.on("error", function(error) {
  console.log("Database Error:", error);
});*/

// Routes
require("./routes/htmlRoutes_async")(app, db);

//Basic find whee title equals value
//var records = 
/*db.articles.find({"title": "William F. Buckley, Jr. and Firing Line: Posturing over Pragmatic Politics"}, function(error, doc){
  console.log(doc);
});*/
 
// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port http://localhost:3000/");
});
