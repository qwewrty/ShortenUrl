var mongo = require("mongodb").MongoClient;
var express = require("express");
var app = express();
var url1 = process.env.MLAB_URI;
mongo.connect(url1, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established');
    var sequence = db.collection('sequence')
    
    var getNextSeq = function(){
        var ret = sequence.findAndModify({_id: 1}, {}, {$inc: {seq: 1}}, {new: true}, function(err,res){
      if(err)
        console.log(err)
      else{
        console.log(res);
      }
    });
    return ret;
    }
    // console.log(getNextSeq());
    
    
    
    // do some work here with the database.
    var url = db.collection('url');
    var obj = {
        id : getNextSeq(),
        url : 'http://www.google.com'
    }
    url.insert(obj, function(err, result){
        if (err) {
            console.log(err);
        } 
        else {
            console.log('Inserted' );
        }
    });
    sequence.find().toArray(function (err, result) {
      if (err) {
            console.log(err);
        } 
        else if (result.length) {
            console.log('Found:', result);
        } 
        else {
            console.log('No document(s) found with defined "find" criteria!');
        }
    });
    //Close connection
    db.close();
  }
});

