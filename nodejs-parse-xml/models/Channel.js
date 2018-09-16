var mongoose = require('mongoose');
const Item = require('../models/Item');
var Schema = mongoose.Schema;

var channelSchema = new Schema({
  title: String,
  link: String,
  description: String,
  language: String,
  pubDate: Date,
  items: [{ type: Schema.Types.ObjectId, ref: 'Item' }]
});
module.exports = mongoose.model('Channel', channelSchema);
