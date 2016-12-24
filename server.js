var mongoose = require("mongoose");
mongoose.connect(process.env.MLAB_URI);
var express = require("express");
var app = express();

//Validation regExp for url string validation.
var regExp = /^(http[s]?:\/\/)(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}/;

//For getting the port number.
app.set('port', (process.env.PORT || 5000))

app.get("/new/:url*",function(req,res){
  //Get the url to be stored.
  var url = req.url.slice(5);
  
  //URL validation.
  if(regExp.test(url)){
  	  //Store the url in db.
	  shortenUrl(url, function(val){
	  	//Create object to be sent.
	  	var obj = {
	  		original_url: url,
	  		short_Url: "https://"+req.headers.host +"/"+val
	  	}
	  	//Send object to response.
	  	res.send(JSON.stringify(obj))
	  });
  }
  else
	res.send("Invalid url entered. Please enter a valid url. Example: 'https://www.google.com' or 'https://google.com' ")
});

//To redirect to the url stored in db.
app.get("/:id",function(req,res){
	var id = Number(req.params.id);
	console.log(id);
	//Redirect to url in db.
	getUrlFromId(id,function(url){
		res.redirect(url);
	})
})

//Listen on a given port.
app.listen(app.get('port'), function(){
    console.log('listening on :'+ app.get('port'))
});

//Function to retrieve url from db using id.
function getUrlFromId(id, callback){
	//Get the url model.
	var urls = require("./url.model");
	urls.find({id: id}, function(err,url){
		if(err)
			console.log(err);
		else{
			return callback(url[0].url);
		}
	});
}

//Function to store a new url in db and get the id.
function shortenUrl(inputUrl, callback){
	//To get the urls collection in db.
	var url = require("./url.model");
	var x = new url({ url: inputUrl});
	x.save(function (err, y){
	  if(err)
	    console.log(err)
	  else
	    console.log("saved "+inputUrl);
	});
	
	var seq = mongoose.model("sequences")
	seq.find({}).exec(function(err, res){
	  if(err)
	    console.log(err)
	  else
	    return callback(res[0].seq);
	});
}
