var express = require("express");
var router = express.Router();

var fs = require("fs");
var xml2js = require("xml2js");
var parser = new xml2js.Parser();

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
        // channel is a json with all the data of a channel
        var channel = result["rss"]["channel"];

        // xmlchannel is an obj of type Channel that will store the xml
        xmlchannel = new Channel({
          title: channel[0].title,
          link: channel[0].link,
          description: channel[0].description,
          language: channel[0].language,
          pubDate: channel[0].pubDate
        });
        // items
        
        
        if(channel[0].item!=null){
          xmlchannel.valid=true;
        channel[0].item.forEach(it => {
          xmlitems = new Item({
            title: it.title,
            link: it.link,
            pubDate: it.pubDate,
            description: it.description,
            enclosure: {
              url: it.enclosure[0]["$"]["url"],
              length: it.enclosure[0]["$"]["length"],
              type: it.enclosure[0]["$"]["type"]
            },
            author: it.author,
            guid: it.guid,
            channel: xmlchannel._id,
            category: it.category
          });
         
          // saving the items
          /* testing the url */
          var lastFour = xmlitems.enclosure.url.substr(
            xmlitems.enclosure.url.length - 4
          );
          if (
            lastFour === ".mp3" ||
            lastFour === ".mp4" ||
            lastFour === ".wmv" ||
            lastFour === ".wmv"
          ) {
            xmlitems.valid = true;
          } else {
            xmlitems.valid = false;
            xmlitems.enclosure.url = null;
            console.log("this item does not have a valid url");
          }
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
        
        xmlchannel.valid=false;
          console.log("channel should have at least one item");
        
      }
        xmlchannel.save(function(err) {
          if (!err) {
            res.send("Done saving the channel!");
          } else {
            console.log("err trying to save the channel!");
            console.log(err);
          }
        });
      });
    }
  });
});

module.exports = router;
