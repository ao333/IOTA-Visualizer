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

let Track = mongoose.model('track_tree', track);

module.exports = Track;