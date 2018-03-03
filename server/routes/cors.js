const express = require("express");
const cors = require('cors');

const whitelist = ['http://localhost:3000','http://127.0.0.1:3000', 'http://51.140.113.215:3000'];
var corsOptionsDelegate = (req, callback) => {
  var corsOptions;

  if(whitelist.indexOf(req.header('Origin')) !== -1){
    corsOptions = {origin: true};
  }else{
    corsOptions = {origin: false};
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);