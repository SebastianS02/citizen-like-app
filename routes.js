//import express.js and db-operations for fetchNearestCops
const express = requre('express');
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