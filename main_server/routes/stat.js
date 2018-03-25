const express = require("express");
const bodyParser = require("body-parser");
const cors = require('./cors');
const Statistics = require('../models/Statistics');

const statRouter = express.Router();
statRouter.use(bodyParser.json());

//send general statistics to client
statRouter.route('/:id')
  .all(cors.corsWithOptions, (req, res, next) =>{
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    next();
  })

  .get(cors.corsWithOptions, (req, res, next) => {
    Statistics.findOne({},function (error, doc) {
      if(error){
        next(error);
        return;
      }
      if(req.params.id === "3"){
        res.json(doc["TotalTips"]);
      }

      else if(req.params.id === "2"){
        res.json(doc["MeanConTime"].toFixed(2));
      }
      else if(req.params.id === "1"){
        res.json(doc["ValuePerSec"].toExponential(3));
      }
      else if(req.params.id === '0'){
        res.json(doc["Price"]);
      }
      else if(req.params.id === '7'){
        res.json(doc["Non_value_Percent"]);
      }
      else{
          next();
      }
    });
  });

module.exports = statRouter;