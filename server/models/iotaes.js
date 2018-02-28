const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const iota_data = new Schema({
  this_hash:{
    type:String,
    required:true,
    unique:true
  },
  trunkTransaction:{
    type:String,
    default:''
  },
  branchTransaction:{
    type:String,
    default:''
  },
  type:{
    type:String,
    required: true
  },
  value:{
    type:String,
    required:true
  }
},{
  timestamps:true
});

var IOTAes = mongoose.model('IOTA', iota_data);

module.exports = IOTAes;
