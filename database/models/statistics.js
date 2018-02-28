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
  }
},{
  timestamps:true
});

var STASs = mongoose.model('STAS', statistics);

module.exports = STASs;
