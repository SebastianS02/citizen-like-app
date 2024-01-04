//require MongoDB mongoose, creates connection between MongoDB and Node.js RTE
const mongoose = require('mongoose');

//Define schema describing info related to a cop
const copSchema = mongoose.Schema({
    userId: { type: String, unique: true, required: true, trim: true },
    displayName: { type: String, trim: true },
    phone: { type: String },
    email: { type: String, unique: true },
    earnedRatings: { type: Number },
    totalRatings: { type: Number },
    location: {
        type: { type: String, required: true, default: "Point" },
        address: { type: String },
        coordinates: [ Number ],
    }
});

copSchema.index({"location": "2dsphere", userId: 1});

/*
*   Represents a Cop.
*   @constructor
*/
//Creates cop model based on schema, then exports it
const Cop = mongoose.model('Cop', copSchema);

const requestSchema = mongoose.Schema({
    requestTime: {type: Date},
    location: {
        coordinates: [Number],
        address: {type: String}
    },
    civilianId: {type: String},
    copId: {type: String},
    status: {type: String}
});

const Request = mongoose.model('Request', requestSchema);

exports.Request = Request;
exports.Cop = Cop;