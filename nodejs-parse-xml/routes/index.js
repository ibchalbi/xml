var express = require("express");
var router = express.Router();
const urlExists = require("url-exists");
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
          console.log(it)
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
         
         
          // saving the item
          // testing the url 
          if (xmlitems.enclosure.url === "/") {
            valid={isValid:false,code:'11',msg:"the URL in this item is empty"}
            xmlitems.valid.push(valid);
          } else {
            var lastFour = xmlitems.enclosure.url.substr(
              xmlitems.enclosure.url.length - 4
            );
            if (
              lastFour === ".mp3" ||
              lastFour === ".mp4" ||
              lastFour === ".wmv" ||
              lastFour === ".wmv"
            ) {
              urlExists(xmlitems.enclosure.url, function(err, exists) {
                if (!exists) {
                  valid={isValid:false,code:'12',msg:"the URL in this item is not valid"}
                  xmlitems.valid.push(valid);
                }
              });
            } else {
              valid={isValid:false,code:'13',msg:"the URL in this item does not provide an audio or video"}
              xmlitems.valid.push(valid);
              console.log("the URL in this item does not provide an audio or video");
            }
        }
        
          //testing the date
          if (xmlitems.pubDate == null) {
            valid={isValid:false,code:'21',msg:"pubDate: does not exsist"}
            xmlitems.valid.push(valid);
            xmlitems.pubDate = new Date();
            console.log("pubDate: does not exsist");
          } else if (!(xmlitems.pubDate instanceof Date)) {
            valid={isValid:false,code:'22',msg:"pubDate: wrong date format"}
            xmlitems.valid.push(valid);
            xmlitems.pubDate = new Date();
            console.log("pubDate: wrong date format");
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
