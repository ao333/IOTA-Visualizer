const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const confirmtime = new Schema({
  create_time:{
    type:Number,
    required:true
  },
  confirm_time:{
    type:Number,
    required: true
  },
},{
  timestamps:true
});

let ConTime = mongoose.model('ConTime', confirmtime);

module.exports = ConTime;