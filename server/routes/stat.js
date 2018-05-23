/**
 * This file is used to serve /stat router, serving statistics in main page
 */

const express = require("express");
const bodyParser = require("body-parser");
const cors = require('./cors');
const Statistics = require('../models/Statistics');
const iota = require('../config/config_iota');

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
      if(!doc || doc.length === 0){
        let e = new Error('cannot find fields');
        e.status = 404;
        next(e);
        return;
      }
      if(req.params.id === "4" && doc["TotalTips"]){
        res.json(doc["TotalTips"]);
      }

      else if(req.params.id === "3" && doc["MeanConTime"]){
        res.json(doc["MeanConTime"].toFixed(2));
      }
      else if(req.params.id === "2" && doc["ValuePerSec"]){
        res.json((doc["ValuePerSec"]*3600).toExponential(2));
      }
      else if(req.params.id === '1' && doc["Price"]){
        res.json(doc["Price"]);
      }
      else if(req.params.id === '7' && doc["Non_value_Percent"]){
        res.json((doc["Non_value_Percent"] * 100).toFixed(2) + '%');
      }
      else if(req.params.id === '0' && doc["ValuePerTran"]){
        res.json((doc["ValuePerTran"]).toExponential(2));
      }
      else if(req.params.id === '6'){
        res.json(doc["MileStone"]);
      }
      else{
          next();
      }
    });
  });

module.exports = statRouter;