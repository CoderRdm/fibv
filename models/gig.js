const mongoose =require('mongoose');
mongoose.connect('mongodb://localhost:27017/testapp1');

const gigschema =mongoose.Schema({
    title:String,
    price:Number,
    category:String,
    description:String,
    workexperience: String,
});

module.exports= mongoose.model('gig',gigschema);