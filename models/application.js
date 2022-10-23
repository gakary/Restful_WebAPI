const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema({
    id:{
        type:String,
    },
   movie:{
        type:String,
   },
   email:{
    type:String,
    minLength:3,
    maxLength:50,
   },
   status:{
    type:String,
   },


});





module.exports = mongoose.model("Application",applicationSchema);
//module.exports = ApplicationModel = mongoose.model("application",applicationSchema);

