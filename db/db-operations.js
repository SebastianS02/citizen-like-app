//import Cop model
const dataModel = require('./data-model');
const Cop = dataModel.Cop;

//Function fetches nearest cop by taking in two parameters,
//then runs a geospatial query using MongoDB and returns the response
function fetchNearestCops(coordinates, maxDistance) {
    return Cop.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: coordinates
                },
                $maxDistance: maxDistance
            }
        }
    })
    .exec()
    .catch(error => { console.log(error) });
}

function fetchCopDetails(userId){
    return Cop.findOne({
        userId: userId
    }, {
        copId: 1,
        displayName: 1,
        phone: 1,
        location: 1
    })
    .exec()
    .catch(error => {
        console.log(error);
    });
}

exports.fetchNearestCops = fetchNearestCops;
exports.fetchCopDetails = fetchCopDetails;