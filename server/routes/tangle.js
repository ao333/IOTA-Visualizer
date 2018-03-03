const express = require("express");
const bodyParser = require("body-parser");
const IOTAes = require('../models/iotaes');
const cors = require('./cors');
const Track_tree = require('../models/track_tree');
const Track_sphere = require('../models/track_sphere');

const tangleRouter = express.Router();

tangleRouter.use(bodyParser.json());

// declare end point in one location, one groups of implementations
tangleRouter.route('/tree_initial')
  .get(cors.corsWithOptions, (req, res, next) => {
  let cursor = IOTAes.find({}).cursor();
  let json_array = [];
  cursor.on('data', function(doc) {
    json_array.push(doc);
  });
  cursor.on('close', function() {
    json_array = getArrayItems(json_array, 100);
    Track_tree.create({oldValue: json_array})
      .then((doc) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.cookie('id_tree', doc._id);
        res.json(json_array);
      }, (err) => next(err))
      .catch((err) => next(err));
  });
});

tangleRouter.route('/sphere_initial')
  .get(cors.corsWithOptions, (req, res, next) => {
    let cursor = IOTAes.find({}).cursor();
    let json_array = [];
    cursor.on('data', function(doc) {
      json_array.push(doc);
    });
    cursor.on('close', function() {
      json_array = getArrayItems(json_array, 400);
      Track_sphere.create({oldValue: json_array})
        .then((doc) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.cookie('id_sphere', doc._id);
          res.json(json_array);
        }, (err) => next(err))
        .catch((err) => next(err));
    });
  });

tangleRouter.route('/delete')
  .get(cors.corsWithOptions, (req, res, next) => {
    let id = req.cookies.id_tree;
    Track_tree.remove({_id:id})
      .then(() =>{
        let id = req.cookies.id_sphere;
        Track_sphere.remove({_id:id})
          .then(() =>{
            res.statusCode = 200;
            res.clearCookie('id_tree');
            res.clearCookie('id_sphere');
            res.end();
          }, (err) => next(err))
          .catch((err) => next(err));
      }, (err) => next (err))
      .catch((err) => next(err));
  });

tangleRouter.route('/tree_update')
  .get(cors.corsWithOptions, (req, res, next) => {
    let id = req.cookies.id_tree;
    Track_tree.findById(id, function (error, docs) {
      if(error){
        console.log(error);
        res.statusCode = 204;
        res.end();
      }else{
        if(docs){
          let update_data = docs["oldValue"];
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(update_data);
        }else{
          res.statusCode = 204;
          res.end();
        }
      }
    })
  });

tangleRouter.route('/sphere_update')
  .get(cors.corsWithOptions, (req, res, next) => {
    let id = req.cookies.id_sphere;
    Track_sphere.findById(id, function (error, docs) {
      if(error){
        console.log(error);
        res.statusCode = 204;
        res.end();
      }else{
        if(docs){
          let update_data = docs["oldValue"];
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(update_data);
        }else{
          res.statusCode = 204;
          res.end();
        }
      }

    })
  });

function getArrayItems(arr, num) {
  let temp_array = new Array();
  for (let index in arr) {
    temp_array.push(arr[index]);
  }
  let return_array = new Array();
  for (let i = 0; i<num; i++) {
    if (temp_array.length>0) {
      let arrIndex = Math.floor(Math.random()*temp_array.length);
      return_array[i] = temp_array[arrIndex];
      temp_array.splice(arrIndex, 1);
    } else {
      break;
    }
  }
  return return_array;
}


module.exports = tangleRouter;