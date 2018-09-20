var express = require("express");
var router = express.Router();
var fs = require("fs");
var xml2js = require("xml2js");
var parser = new xml2js.Parser();

var verify = require("./verification");
var mongoose = require("mongoose");
var Channel = mongoose.model("Channel");
var Item = mongoose.model("Item");
// paring nd storing the xml file
router.get("/", function(req, res, next) {
  console.log("parsing the xml file");
  // path for the file
  var xmlfile = __dirname + "/../public/xmlfiles/channelxml.xml";
  //parsing the xml
  fs.readFile(xmlfile, "utf-8", function(error, text) {
    if (error) {
      throw error;
    } else {
      parser.parseString(text, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (verify.verifyChannel(result)) {
            var channel = result["rss"]["channel"];
            channel.valid = true;
            xmlchannel = verify.verifyAndCreateChannel(channel);
            if (verify.verifyItemExsist(channel)) {
              channel[0].item.forEach(it => {
                xmlitems = verify.verifyAndCreateItem(it);

                //saving the item
                Item.collection.insert(xmlitems, function(err, doc) {
                  if (err) {
                    console.log("err trying to save an item!");
                    return;
                  } else {
                    console.log("Done saving the items!");
                  }
                });
              });
            } else {
              xmlchannel.valid = false;
              errorsMsg = {
                code: "100",
                msg: "Channel does not have any item"
              };
              xmlchannel.errorsMsg.push(errorsMsg);
            }
          } else {
            xmlchannel = new Channel();
            xmlchannel.valid = false;
            errorsMsg = {
              code: "10",
              msg: "Channel does not exsist"
            };
            xmlchannel.errorsMsg.push(errorsMsg);
          }
          Channel.collection.insert(xmlchannel, function(err, doc) {
            if (err) {
              console.log("err trying to save the channel!");
              return;
            } else {
              console.log("Done saving the channel");
              res.send("done saving the channel");
            }
          });
        }
      });
    }
  });
});

module.exports = router;
