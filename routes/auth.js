const router = require("express").Router();
const registerValidation = require("../validation").registerValidation
const loginValidation = require("../validation").loginValidation;
const User = require("../models").userModel;
const jwt = require("jsonwebtoken");

//middleware
//when the request come in , have to process authentication
router.use((req,res,next)=>{
    console.log("new request");
    next();
})


//register
router.post("/register",async (req,res)=>{
    const {error} = registerValidation(req.body);
    //check the validation of data
    //return the statusCode 400 and send the error message :"role" must be one of [member, staff]
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    //check if the user is that exist
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist){
        return res.status(400).send("Email exist , Please using the other email.");
    }else{
        const newUser = new User({
            email:req.body.email,
            username:req.body.username,
            password:req.body.password,
            role:req.body.role,
        })
        try{
            const savedUser = await newUser.save();
            res.status(200).send({
                msg:"success",
                saveObject:savedUser,
            })
        }catch(err){
            res.status(400).send("User not saved");
        }
    }
})

//login
router.post("/login",(req,res)=>{
    //check the validation of data
    const{error} = loginValidation(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    //DB result assign to the user variable
    User.findOne({email:req.body.email}, function(error,user){
        if(error){
            res.status(400).send(error);
        }
        //find not find the user
        if(!user){
            res.status(401).send("User not found.");
        }else{
            //call the function of comparePassword
            user.comparePassword(req.body.password,function(error,correct){
                //error catching
                if(error){
                    return res.status(400).send(error);
                }
                if(correct){
                    //create the JWT token
                    const tokenObject = {_id:user._id,email:user.email};
                    const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
                    //send back to the user
                    res.status(200).send({success:true,token:"JWT " + token, user});
                }else{
                    res.status(401).send("Invalid Password or Email!");
                }
            })
        }
    })
})

 /**
  * @swagger
  * tags:
  *   name: Users
  *   description: The users managing API
  */


/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Create a new account on film website
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/users'
 *     responses:
 *       200:
 *         description: The account was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/users'
 *       400:
 *         description: Email exist , Please using the othere email
 */

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: login on film website
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/users'
 *     responses:
 *       200:
 *         description: The account was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/users'
 *       401:
 *         description: Invalid Password or Email
 */


module.exports = router;