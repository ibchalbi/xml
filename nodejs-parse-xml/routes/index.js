var express = require('express');
var router = express.Router();
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var mongoose = require('mongoose');

var Channel  = mongoose.model('Channel');
var Item  = mongoose.model('Item');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('parsing the xml file');
  // path for the file
  var xmlfile=__dirname+"/../public/xmlfiles/channelxml.xml";
  fs.readFile(xmlfile,"utf-8",function(error,text) {
    if(error) {
      throw error;
    } else {
      parser.parseString(text, function(err, result) {
        // channel is a json with all the data
        var channel=result['rss']['channel'];
    var items= [];
        xmlchannel= new Channel({
          title: channel[0].title,
          link: channel[0].link,
          description: channel[0].description,
          language: channel[0].language,
          pubDate: channel[0].pubDate
        });
        channel[0].item.forEach(function(it) { 
          xmlitems= new Item({
            title: it.title,
            link: it.link,
            category: it.category,
            pubDate: it.pubDate,
            description: it.description,
            enclosure: it.enclosure,
            author: it.author,
            guid: it.guid,
            channel: xmlchannel._id
          });
          xmlitems.save(function(err) {
           
          });
          xmlchannel.items.push(xmlitems);

        })
        xmlchannel.save(function(err) {
          if (!err) {
            res.send("Done importing xml!");
          }else {
            res.send(err);
          }
    });
        
      });
    }
  });
 
});
router.get('/channel/:id', function(req, res, next) {
  Channel.
  findOne({ _id: req.params.id }).
  populate('items'). 
  exec(function (err, channel) {
    if (err) return handleError(err);
    console.log(channel);
  });
});
module.exports = router;
