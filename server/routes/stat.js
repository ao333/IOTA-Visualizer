const express = require("express");
const bodyParser = require("body-parser");
const STASs = require('../models/statistics');
const cors = require('./cors');
const statRouter = express.Router();

statRouter.use(bodyParser.json());

// declare end point in one location, one groups of implementations
statRouter.route('/:id')
  .all(cors.corsWithOptions, (req, res, next) =>{
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    next(); //continue on to look for additional specification below which match ./dishes
  })

  .get(cors.corsWithOptions,(req, res, next) => {
    var cursor = STASs.find({}).cursor();
    var json_array = [];
    cursor.on('data', function(doc) {
      json_array.push(doc);
    });
    cursor.on('close', function() {
      if(json_array.length == 1){
        if(req.params.id === "0"){
          res.json(json_array[0]["TotalTips"]);
        }

        else if(req.params.id === "1"){
          res.json(json_array[0]["MeanConTime"].toFixed(2));
        }
        else if(req.params.id === "2"){
          res.json(json_array[0]["ValuePerSec"]);
        }
        else{
          res.end();
        }
      }
      else{
        res.end();
      }
    });
  });

module.exports = statRouter;