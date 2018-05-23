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
