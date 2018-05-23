/**
 * MongoDB database Record Schema
 * this schema collection stores current records for statistics so that we can show
 * current status of statistics in front end
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statistics = new Schema({
  TotalTips:{
    type:Number,
    default:0
  },
  MeanConTime:{
    type:Number,
    default:0
  },
  ValuePerSec:{
    type:Number,
    default:0
  },
  Non_value_Percent:{
    type:Number,
    default:0
  },
  Price:{
    type:Number,
    default:0
  },
  ValuePerTran:{
    type:Number,
    default:0
  },
  MileStone:{
    type:String
  }
},{
  timestamps:true
});

let STAS = mongoose.model('STAS', statistics);

module.exports = STAS;
