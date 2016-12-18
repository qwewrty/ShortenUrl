var mongo = require("mongodb").MongoClient;
var url = process.env.MLAB_URI;

mongo.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established');
    var sequence = db.collection('sequence')
    
    //Find and modify the sequence counter.
    // var obj = sequence.findAndModify(
    //   {_id: 1},
    //   {},
    //   {  $inc: {"seq": 1}},      
    //   {new:true, upsert:true}
    // );
    
    var obj;
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
    //console.log(obj);
    
    console.log(getNextSeq());
    sequence.find({_id:1}).toArray(function(err,res){
      if(err)
        console.log(err);
      else
        console.log(res)
    });
    
     db.close();
  }
});
