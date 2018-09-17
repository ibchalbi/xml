var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Company = require('./Channel');
require('mongoose-type-url');

var itemSchema = new Schema({
 
      title: String,
      link: String,
      category: String,
      pubDate: {type:Date,default:new Date(), required:true},
      description: String,
      enclosure:  {
            url: { type: mongoose.SchemaTypes.Url },
            length: {type: Number},
            type:{type: String}
          },
      author: String,
      guid: String,
      channel : { type: Schema.Types.ObjectId, ref: 'Channel' },
      valid: Boolean
    
});

module.exports = mongoose.model('Item', itemSchema);
/*
itemSchema.path('enclosure.url').validate(function(url) {
     
      var lastThree = url.substr(url.length - 3);
      if (lastThree === "mp3" || lastThree === "mp4") {
            return true;
      }
      else 
            return false;
  }, 'Invalid url');
  */
