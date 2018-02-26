const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stat = new Schema({
  notFinished:{
    type:Array,
    default: []
  },
  Finished:{
    type:Array,
    default:[]
  }
},{
  timestamps:true
});

var states = mongoose.model('STAT', stat);

module.exports = states;
