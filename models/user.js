const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({



    username:{
        type:String,
        reqired:true,
        minLength:3,
        maxLength:50,
    },
    email:{
        type:String,
        required:true,
        minLength:6,
        maxLength:100,
    },
    password:{
        type:String,
        required:true,
        minLength:6,
        maxLength:244,
    },
    role:{
        type:String,
        enum:["member","staff",],
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//To Check is that this role , if not return false
userSchema.methods.ismember = function(){
    return this.role == "member";
};

userSchema.methods.isIntructor = function (){
    return this.role == "staff";
};



//middleare
//mongoose
//To process the hashing
userSchema.pre("save", async function(next){
    if(this.isModified("password") || this.isNew){
        const hash = await bcrypt.hash(this.password,10);
        this.password = hash;
        next();
    }else{
        return next();
    }
})

//user input password , database encryption password
userSchema.methods.comparePassword = function(password, callBack){
    bcrypt.compare(password, this.password, (err, correct)=>{
        if(err){ return callBack(err,correct);
    }callBack(null, correct);})
};

module.exports = mongoose.model("User",userSchema);