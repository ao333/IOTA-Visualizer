/**
 * MongoDB database Record Schema
 * this schema collection stores records for statistics so that we can show
 * history of statistics in front end
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const record = new Schema({
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
  ValuePerTran:{
    type:Number,
    default:0
  }
},{
  timestamps:true
});

let Record = mongoose.model('Record', record);
module.exports = Record;
