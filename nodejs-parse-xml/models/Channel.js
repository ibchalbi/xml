var mongoose = require('mongoose');
const Item = require('./Item');
var Schema = mongoose.Schema;

var channelSchema = new Schema({
  title: String,
  link: String,
  description: String,
  language: String,
  pubDate: Date
});
module.exports = mongoose.model('Channel', channelSchema);
