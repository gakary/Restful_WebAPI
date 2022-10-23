const mongoose = require("mongoose");
const movieSchema = new mongoose.Schema({
    id:{
        type:String,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    staff:{
        //to save the staff save into this
        type:mongoose.Schema.Types.ObjectId,ref:"User",
    },

});

const movie = mongoose.model("movie",movieSchema);
module.exports = movie;