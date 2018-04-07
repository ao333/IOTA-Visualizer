const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const meancontime = new Schema({
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

let Meancontime = mongoose.model('meancontime', meancontime);
module.exports = Meancontime;
