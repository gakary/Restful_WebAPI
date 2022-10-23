const router = require("express").Router();
const multer = require("multer");
const Application = require("../models").applicationModel;
const applicationValidation = require("../validation").applicationValidation;


//multer , upload images
router.use((req,res,next)=>{
    console.log("new application request");
    next();
})

const Storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,callback)=>{
        callback(null,file.originalname);
    },
});

const upload = multer({
    storage:Storage
}).single("avatar");

router.get("/",(req,res)=>{
    res.send("upload file");
});



//get application form data
router.get(":_member_id",(req,res)=>{
    let {_member_id} = req.params;
    Application.find( {member: _member_id})
        .then((applications)=>{
        res.status(200).send(applications)
    }).catch(()=>{
        res.status(500).send("Cannot get data.");
    })
})


//get all the informations
router.get("/getall", (req, res) => {
    Application.find({})
      .then((applications) => {
        res.status(200).send(applications);
      }).catch(() => {
        res.status(404).res.send("Cannot get data");
      });
  });



//find the application through the email
router.get("/findByEmail/:email",(req,res)=>{
    let{email} = req.params;
    console.log(email);
    Application.find({email:email}).then(application=>{
        res.status(200).send(application);
    }).catch((error)=>{
        res.status(500).send(error);
    })
})


//submit a application
router.post("/upload",async (req,res)=>{
    //check before make
    const {error} = applicationValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //If OK
    upload(req,res,async(error)=>{
        let{movie,email} = req.body;
        let status = "pending";
        if(error){
            console.log(error)
        }
       else{
            //set up
            let newapplication = new Application({
                movie,
                email,
                status,
            })
            //insert
                 newapplication.save().then(()=>{
                res.status(200).send("Successfully Submit!")


            }).catch((error)=>res.status(400).send("Cannot Submit!"));
        
        }
    })
 
})


//patch 
router.patch("/:email",async(req,res)=>{
    //check before make
    const {error} = applicationValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let{email} = req.params;
    let appform
    appform = await Application.findOne({email});
    if(!appform){
        res.status(404);
        return res.json({
            success: false,
            message: "movie not found.",
        });
    }
    //to check the id is that same guy , who create this , who can update this
    if(appform.email==email){
        Application.findOneAndUpdate({email},req.body,{
            new:true,
            runValidators:true,
        }).then(()=>{
            res.send("application updated.");
        }).catch(error =>{
            res.send({
                success:false,
                message:error,
            })
        })
    }else{
        res.status(403);
        return res.json({
            success:false,
            message:"Only the staff can change the status of application.",
        })
    }
})



/*

     react not working of this post

//upload application form with images

router.post("/upload",(req,res)=>{
    //check before make
    const {error} = applicationValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //If OK
    upload(req,res,(error)=>{
        let{movie,email,avatar} = req.body;
        let status = "pending";
        if(error){
            console.log(error)
        }else{
            //set up
            let newapplication = new application({
                movie,
                email,
                status,
                avatar:{
                    data:req.file.filename,
                    contentType:'image/png'
                }
            })
            //insert
                 newapplication.save().then(()=>{
                res.status(200).send("Successfully Submit!")
            }).catch((error)=>res.status(400).send("Cannot Submit!"));
        
        }
    })
})

*/




//delete the application
router.delete("/:email", async(req,res)=>{
    let {email} = req.params;
    let application = await Application.findOne({email});
    console.log(email);
    if(!application){
        res.status(404);
        return res.json({
            success:false,
            message:"Not found the application! Please typing the other id.",
        });
    }
    if(email!=null){
        Application.deleteOne({email},{
            new:true,
            runValidators:true,
        }).then(()=>{
            res.status(200).send("The application have been deleted!");
        }).catch(error=>{
            res.send({
                success:true,
                message:error,
            })
        })
    }
})

/**
 * @swagger
 * components:
 *   schemas:
 *     users:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-genrated id of the user
 *         username:
 *           type: string
 *           description: The member's account username
 *         email:
 *           type: string
 *           description: The member's account email, using to login
 *         password:
 *           type: string
 *           description: The member website's account password, using to login, it process the hashing
 *         role:
 *           type: string
 *           description: The member permission access
 *         date:
 *           type: date
 *           description: The auto-genrated user registration time
 *       example:
 *           id: 413992aa5behaw3sg75a16987
 *           username: Peter Wong
 *           email: peterwong@gmail.com
 *           password: $2b$10$o9D0qMBXxECiObrwYELTw.VD.JOalDtjfI45PUmKn9oq8TEa5W5La
 *           role: member
 *           date: 2022-09-24T19:28:01.759+00:00
 */
 
/**
 * @swagger
 * components:
 *   schemas:
 *     movies:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the movie
 *         title:
 *           type: string
 *           description: The film title
 *         price:
 *           type: string
 *           description: The browse price of this film
 *         staff:
 *           type: object
 *           description: The staff id , to record which staff are post this film
 *       example:
 *           id: 657891aa5behaw3sg75a16987
 *           title: The Imitation Game
 *           price: 200
 *           staff: 123321ha5bewoh3sg75a32195
 */          

/**
 * @swagger
 * components:
 *   schemas:
 *     applications:
 *       type: object
 *       required:
 *         - movie
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the application
 *         movie:
 *           type: string
 *           description: The memeber which film want to browse
 *         email:
 *           type: string
 *           description: The member which contact email address
 *         status:
 *           type: string
 *           description: The status of the process of this application,which including pending, accepted, rejected
 *       example:
 *           id: 432122oa5pepew3sg75a65211
 *           movie: The Imitation Game
 *           email: leo@gmail.com
 *           status: pending
 *        
 */


/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: The movie applications API
 */


/**
 * @swagger
 * /api/application/{_member_id}:
 *   get:
 *     summary: Get the application by the member id
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The member id
 *     responses:
 *       200:
 *         description: List member's application by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/applications'
 *       500:
 *         description: Cannot get data
 */


/**
 * @swagger
 * /api/application/getall:
 *   get:
 *     summary: Get all the application
 *     tags: [Applications]
 *     responses:
 *       200:
 *         description: List member's application by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/applications'
 *       500:
 *         description: Cannot get data
 */

/**
 * @swagger
 * /api/application/{email}:
 *   get:
 *     summary: Find the application by email
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The member's application contact email
 *     responses:
 *       200:
 *         description: List the which contact email application
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/applications'
 *       500:
 *         description: Server something error
 */

/**
 * @swagger
 * /api/application/upload:
 *   post:
 *     summary: Create a new application form to borrow the film
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/applications'
 *     responses:
 *       200:
 *         description: The application was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/applications'
 *       400:
 *         description: Cannot Submit
 */

/**
 * @swagger
 * /api/application/{email}:
 *  patch:
 *    summary: Update the application by the email
 *    tags: [Applications]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The movie id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/applications'
 *    responses:
 *      200:
 *        description: application updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/applications'
 *      403:
 *        description: Only staff permission can update the movie
 *      404:
 *        description: movie not found
 */

/**
 * @swagger
 * /api/application/{id}:
 *   delete:
 *     summary: Remove the application by id
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: title
 *         schema:
 *           type: string
 *         required: true
 *         description: The movie title
 * 
 *     responses:
 *       200:
 *         description: The application have been deleted
 *       404:
 *         description: The application have been deleted
 */


module.exports = router;