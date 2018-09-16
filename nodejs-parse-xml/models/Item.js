var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Company = require('../models/Channel');

var itemSchema = new Schema({
 
      title: String,
      link: String,
      category: String,
      pubDate: Date,
      description: String,
      enclosure: String,
      author: String,
      guid: String,
      channel : { type: Schema.Types.ObjectId, ref: 'Channel' }
    
});
module.exports = mongoose.model('Item', itemSchema);
