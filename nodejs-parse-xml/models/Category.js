var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
  type: {type:String, unique:true, require:true}
 
});

module.exports = mongoose.model('Category', categorySchema);
