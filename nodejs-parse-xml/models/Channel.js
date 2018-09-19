var mongoose = require('mongoose');
const Item = require('./Item');
var Schema = mongoose.Schema;

var channelSchema = new Schema({
  title: {type:String, required:true},
  link: String,
  description: String,
  language: String,
  pubDate: {type:Date,default:new Date(), required:true},
  valid:Boolean
});
module.exports = mongoose.model('Channel', channelSchema);
