//import http, express, consolidate, body-parser, and mongoose
const http = require('http');
const express = require('express');
const consolidate = require('consolidate');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes'); //import routes.js, file that contains endpoints

const app = express();

//body-parser parses incoming request bodies before the handlers to handle POST requests
app.use(bodyParser.urlencoded({
    extended: true,
}));

app.use(bodyParser.json({
    limit: '5mb'
}));

app.set('views', 'views');
app.use(express.static('./public'));

app.set('view engine', 'html');
app.engine('html', consolidate.handlebars);

//connect to database
const db = 'mongodb://localhost:27017/citizenLikeApp';
mongoose.connect(db).then(value => {
    //Successful connection
    console.log(value.models);
}).catch(error => {
    //Error in connection
    console.log(error);
});

app.use('/', routes);

const server = http.Server(app);
const portNumber = 8000;

server.listen(portNumber, () => {
    console.log(`Server listening at port ${portNumber}`);
});