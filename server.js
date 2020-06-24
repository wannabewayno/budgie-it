// Configure environemnt variables
// ==============================================================================
require('dotenv').config();

// dependencies
// ==============================================================================
const express = require("express");
const logger = require("morgan");
const compression = require("compression");

// Set up our app and configure the com port
const PORT = process.env.PORT || 3141;
const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// routes
app.use(require("./routes/api.js"));


// set up the db connection and start the server
// ==============================================================================
const connection = require('./config/connection');
connection
.then( () => app.listen( PORT, () => console.log(`App running on port ${PORT}!`) ) );