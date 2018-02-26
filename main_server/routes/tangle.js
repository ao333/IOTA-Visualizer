const express = require("express");
const bodyParser = require("body-parser");
const IOTAes = require('../models/iotaes');
const cors = require('./cors');
const Track = require('../models/track');

const tangleRouter = express.Router();

tangleRouter.use(bodyParser.json());

// declare end point in one location, one groups of implementations
tangleRouter.route('/initial')
  .get(cors.corsWithOptions, (req, res, next) => {
  var cursor = IOTAes.find({}).cursor();
  var json_array = [];
  cursor.on('data', function(doc) {
    json_array.push(doc);
  });
  cursor.on('close', function() {
    Track.create({oldValue: json_array})
      .then((doc) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.cookie('id', doc._id);
        res.json(json_array);
      }, (err) => next(err))
      .catch((err) => next(err));
  });
});

tangleRouter.route('/delete')
  .get(cors.corsWithOptions, (req, res, next) => {
    var id = req.cookies.id;
    Track.remove({_id:id})
      .then(() =>{
        res.statusCode = 200;
        res.clearCookie('id');
        res.end();
      }, (err) => next (err))
      .catch((err) => next(err));
  });

tangleRouter.route('/update')
  .get(cors.corsWithOptions, (req, res, next) => {
    var id = req.cookies.id;
    Track.findById(id, function (error, docs) {
      var update_data = docs["oldValue"];
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(update_data);
    })

  });


module.exports = tangleRouter;