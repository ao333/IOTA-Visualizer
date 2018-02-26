const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const track = new Schema({
  oldValue:{
    type:Array,
    default:[]
  },
  updateValue:{
    type:Array,
    default:[]
  }
},{
  timestamps:true
});

var Track = mongoose.model('TRACK', track);

module.exports = Track;