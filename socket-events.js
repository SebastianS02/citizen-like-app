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

        //Listen to a 'request-for-help' event from connected civilians
        socket.on('request-for-help', async(eventData) => {
            /*
                eventData contains userId and location
                1. First save the request details in the collection requestsData
                2. After saving, fetch nearby cops from civilians location
                3. Fire a request-for-help event to each of the cop's rooms
            */

            //Step 1
            const requestTime = new Date(); //Time of the request
            const requestId = mongoose.Types.ObjectId(); //Generate unique Id for the request

            const location = { //Convert latitude and longitude to [longitude, latitude]
                coordinates: [ //MongoDB coordinate format is [long, lat]
                    eventData.location.longitude,
                    eventData.location.latitude
                ],
                address: eventData.location.address
            };

            await dbOperations.saveRequest(requestId, requestTime, location, eventData.civilianId, 'waiting');

            //Step 2
            const nearestCops = await dbOperations.fetchNearestCops(location.coordinates, 2000);
            eventData.requestId = requestId;

            //Step 3
            for(let i = 0; i < nearestCops.length; i++){
                io.sockets.in(nearestCops[i].userId).emit('request-for-help', eventData);
            }
        });

        socket.on('request-accepted', async (eventData) => { //Listen to a 'request-accepted' event from connected cops
            console.log('eventData contains', eventData);
            //Convert string to MongoDB's ObjectId data type
            const requestId = mongoose.Types.ObjectId(eventData.requestDetails.requestId);

            //Then update the request in the database with the cops details for given requestId
            await dbOperations.updateRequest(requestId, eventData.copDetails.copId, 'engaged');

            //After updating the request, emit a 'request-accepted' event to the civilian and send cop details
            io.sockets.in(eventData.requestDetails.civilianId).emit('request-accepted', eventData.copDetails);
        });
    });
}

exports.initialize = initialize;