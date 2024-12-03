const express = require('express');
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const {signIn} = require("./src/middlewares/auth");
const {isAdmin} = require("./src/middlewares/isAdmin");


// Parse request bodies as JSON
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

var users = require('./src/routes/users');
var admin = require('./src/routes/admin');
var participants = require('./src/routes/participants')
var chat = require('./src/routes/messages');
var rooms = require('./src/routes/rooms');

//Users route
app.use('/users', users);

//Participants route
app.use('/participants', participants);

// Verify route
app.use('/connected', signIn, users )

//Admin route
app.use('/admin', [signIn, isAdmin], admin)

//Message route
app.use('/chat', chat);

//Rooms route
app.use('/rooms', rooms);

// Start servera
app.listen(3000, () => {
	console.log('API server listening on port 3000');
});
