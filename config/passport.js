const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models").userModel;


//Josn Web Token
module.exports = (passport) =>{
    let opts ={};
    //To check is that contain jwt token with the user request
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    //My encryption key
    opts.secretOrKey = process.env.PASSPORT_SECRET;
    passport.use(new JwtStrategy(opts, function(jwt_payload, done){
        User.findOne({_id:jwt_payload._id}, (error,user)=>{
            if(error){
                return done(error,false);
            }if(user){//If found the user's jwt token
                return done(null, user);
            }else{{//If not found the user's jwt token
                    return done(null, false);
                }
            }
        })
    }))
}