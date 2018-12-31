
<h1 align="center">Artifice Mongo Scraper</h1>
<p align="center"><kbd><img src ="public/images/mongoscraper.png"/></kbd></p><br/>

This project is a web app that scrapes news articles from [The Artifice](https://the-artifice.com) website.  It allows users to scrape, save, and hide articles.  The articles are stored and updated in a MongoDB database.  In addition the user can add notes to saved articles.
# Demo
*https://cryptic-refuge-29521.herokuapp.com/articles<br/>
# Setup
In order to run the app, you will need to clone this repository and install all required technologies listed below.
# Required Technologies
1. [Node.js LTS](https://nodejs.org/en/)<br/>
2. [NPM](https://www.npmjs.com/get-npm)<br/>
3. [Git & Git Bash](https://git-scm.com/downloads)<br/>
4. [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)<br/>
5. [Robo 3T](https://robomongo.org/download)<br/>
# NPM Modules Used
1. axios
2. cheerio
3. express
4. express-handlebars
5. mongoose
# Installation Steps
1. Open Bash and Clone the artifice-mongo-scraper repo
2. Install all required technologies
3. In Bash, change the current directory to the artifice-mongo-scraper directory and install all modules from the package.json, using the following command:
    1. npm i [Enter]  
# Execute Program
1. In Bash, enter the following command in the artifice-mongo-scraper directory, to start the server.
    1. node server.js [ENTER]
2. Open your browser and type the following URL:
    1. http://localhost:3000
# Use
This repo is available for public non-commercial use only.
# Goal
The goal of this project was to create a web scraper using axio and cheerio modules that incoporates REST and data storage.  Mongoose and MongoDB is used for REST and data persistence, respectively. In addition, Express is used as middleware, which communicates between the web app and the Node.js web server.  Express-Handlebars is used to manage frontend views and templating.

