//import express.js and db-operations for fetchNearestCops
const express = require('express');
const router = express.Router();
const dbOperations = require('./db/db-operations');

router.get('/cops', async(req, res) => {
    /*  
        extract lat and log info from request query parameters
        Then, fetch nearest cops using MongoDB geospatial queries and return back to client
    */
   const latitude = Number(req.query.lat);
   const longitude = Number(req.query.lng);
   const nearestCops = await dbOperations.fetchNearestCops([longitude, latitude], 2000);

   //convert response data to JSON
   res.json({
       cops: nearestCops
   });
});

router.get('/civilian.html', (req, res) => {
    res.render('civilian.html', {
        userId: req.query.userId
    });
});

router.get('/cop.html', (req, res) => {
    res.render('cop.html', {
        userId: req.query.userId
    });
});

router.get('/cops/info', async (req, res) => { //Endpoint calls a function to fetch a cops profile info
    const userId = req.query.userId; //Extract userId from query params
    const copDetails = await dbOperations.fetchCopDetails(userId);

    res.json({ //return results in JSON format
        copDetails: copDetails
    });
});

module.exports = router;