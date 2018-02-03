const express = require("express");
const bodyParser = require("body-parser");
const IOTAes = require('../models/iotaes');


const tangleRouter = express.Router();

tangleRouter.use(bodyParser.json());

// declare end point in one location, one groups of implementations
tangleRouter.route('/')
  .all((req, res, next) =>{
  res.statusCode = 200;
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  next(); //continue on to look for additional specification below which match ./dishes
})

.get((req, res, next) =>{
  console.log(1);
  IOTAes.find({}).then((iotaes) =>{
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(iotaes);
  }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = tangleRouter;