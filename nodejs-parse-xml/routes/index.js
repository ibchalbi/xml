var express = require('express');
var router = express.Router();
var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var mongoose = require('mongoose');

var Channel  = mongoose.model('Channel');
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
        // item is the aray that will have the items info
        var itemstable= [];
        channel[0].item.forEach(function(it) { 
          itemstable.push(it);
        })
        xmlchannel= new Channel({
          title: channel[0].title,
          link: channel[0].link,
          description: channel[0].description,
          language: channel[0].language,
          pubDate: channel[0].pubDate,
          items: itemstable  
        });
        xmlchannel.save(function(error){
         
            if(error){
                 throw error;
            }
        }); 
        
      });
    }
  });
});

module.exports = router;
