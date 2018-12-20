/*********************************************************************************/
//DATABASE Connection
/*********************************************************************************/
// Dependencies
var cheerio = require("cheerio");
var axios = require("axios");
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Set up a static folder (public) for our web app
app.use(express.static("public"));

//Use Handlebars
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Database configuration
// Save the URL of our database as well as the name of our collection
var databaseUrl = "artifice_db";
//var collections = ["articles"];

// Use mongoose to hook the database to the db variable
// Require all models
var db = require("./models");
require("./routes/htmlRoutes")(app, axios, cheerio);

// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/" + databaseUrl;

mongoose.connect(MONGODB_URI);

/*************************************************************/

// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
            "Grabbing every thread name and link\n" +
            "from reddit's webdev board:" +
            "\n***********************************\n"); 
// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port http://localhost:3000/");
});//listen