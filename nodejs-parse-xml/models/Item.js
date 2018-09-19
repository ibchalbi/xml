var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Company = require('./Channel');
require('mongoose-type-url');

var itemSchema = new Schema({
 
      title: String,
      link: String,
      category: String,
      pubDate: Date,
      description: String,
      enclosure:  {
            url: { type: mongoose.SchemaTypes.Url },
            length: {type: Number},
            type:{type: String}
          },
      author: String,
      guid: String,
      channel : { type: Schema.Types.ObjectId, ref: 'Channel' },
      valid:[{
            isValid:{type:Boolean,default:true},
            code :Number,
            msg:String
      }]
    
});

module.exports = mongoose.model('Item', itemSchema);

