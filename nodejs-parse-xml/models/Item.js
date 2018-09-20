var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const Channel = require("./Channel");
require("mongoose-type-url");

var itemSchema = new Schema({
  title: { type: String, required: true },
  link: String,
  category: String,
  pubDate: Date,
  description: String,
  enclosure: {
    url: { type: mongoose.SchemaTypes.Url },
    length: { type: Number },
    type: { type: String }
  },
  author: String,
  guid: String,
  channel: { type: Schema.Types.ObjectId, ref: "Channel" },
  valid: { type: Boolean, default: true, required: true },
  errorsMsg: [
    {
      code: Number,
      msg: String
    }
  ],
  subtitle: String,
  summary: String,
  keywords: String,
  explicit: Boolean,
  image: String,
  duration: String
});

module.exports = mongoose.model("Item", itemSchema);
