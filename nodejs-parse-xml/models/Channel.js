var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var channelSchema = new Schema({
  title: String,
  link: String,
  description: String,
  language: String,
  pubDate: String,
  items: 
    [{
      title: String,
      link: String,
      category: String,
      pubDate: String,
      description: String,
      enclosure: String,
      author: String,
      guid: String
    }]
});
module.exports = mongoose.model('Channel', channelSchema);
