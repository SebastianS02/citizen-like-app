const dbOperations = require('./db/db-operations');
const mongoose = require('mongoose');

function initialize(server){
    //Creating a new socket.io instance by passing the HTTP server object
    const io = require('socket.io')(server);

    io.on('connection', (socket) => { //Listen on the 'connection' event for incoming sockets
        console.log('A user has connected');

        socket.on('join', (data) => {
            socket.join(data.userId); //User joins a unique room/channel named after userId
            console.log(`User joined room: ${data.userId}`);
        });
    })
}

exports.initialize = initialize;