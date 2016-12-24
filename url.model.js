var mongoose = require("mongoose")
var schema = mongoose.Schema;
var urlSchema = schema({
    id: Number,
    url: String
});
var seq = mongoose.model("sequences", {_id: Number, seq: Number})

urlSchema.pre("save",function(next){
	var doc = this;
	seq.findByIdAndUpdate({_id:1}, {$inc:{seq:1}},function(err,count){
		if(err)
			return next(err)
		doc.id = count.seq;
		return next();
	})
})
module.exports = mongoose.model("url", urlSchema);