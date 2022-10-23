const router = require("express").Router();
const Movie = require("../models").movieModel;
const movieValidation = require("../validation").movieValidation;

//middleware
router.use((req,res,next)=>{
    console.log("A request is coming into api...");
    next();
});

//get all the informations
router.get("/", (req, res) => {
    Movie.find({})
      .then((movie) => {
        res.send(movie);
      }).catch(() => {
        res.send(e);
      });
  });

  //search movie
router.get("/findByName/:name",(req,res)=>{
    let {name} = req.params;
    Movie.find({title:name})
    .then(movie =>{
        res.status(200).send(movie);
    }).catch((err)=>{
        res.status(500).send(err);
    })
})


router.get("/member/:_member_id",(req,res)=>{
    let {_member_id} = req.params;
    Movie.find( {members: _member_id})
        .then((movies)=>{
        res.status(200).send(movies)
    }).catch(()=>{
        res.status(500).send("Cannot get data.");
    })
})


  //get an staff 's movie data
router.get("/staff/:_staff_id",(req,res)=>{
    let {_staff_id} = req.params;
    Movie.find({staff:_staff_id})
    .then((data)=>{
        res.send(data);
    }).catch(()=>{
        res.status(500).send("Cannot get movie data.");
    });
});


//x
  //every movie have a member array , if insert the member id into it will search
router.post("/search/:_id",async(req,res)=>{
    let {_id} = req.params;
    let {user_id} = req.body;
    try{
        let movie = await Movie.findOne({_id})
        //add into array
        movie.members.push(user_id);
        await movie.save();
        res.send("FINISH");
    }catch(error){
        res.send(error);
    }
})



  //Add the new movie
router.post("/",async(req,res)=>{
    //validation
    const {error} = movieValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //If OK
    let {title , description , price} = req.body;
    if(req.user.ismember()){
        res.status(400).send("Only staff can post a new movie.");
    }else{
        //insert
        let newmovie = new Movie({
            title,
            description,
            price,
            staff:req.user.id,
        });
        //catch error handling
        try{
            await newmovie.save();
            res.status(200).send("New movie has been saved.");
        }catch(error){
            res.status(400).send("Cannot save movie.");
        }
    }
})


//patch 
router.patch("/:_id",async(req,res)=>{
    //validation
    const {error} = movieValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //find the is that exist
    let{_id} = req.params;
    let movie
     movie = await Movie.findOne({_id});
    if(!movie){
        res.status(404);
        return res.json({
            success: false,
            message: "movie not found.",
        });
    }
    //Same Staff to update the movie , because it have to take responsibility to member
    if(movie.staff.equals(req.user._id)){
        //update
        Movie.findOneAndUpdate({_id},req.body,{
            new:true,
            runValidators:true,
        }).then((error)=>{
            res.status(200);
            res.send("movie updated.");
        }).catch(error =>{
            res.send({
                success:false,
                message:error,
            })
        })
    }else{
        //catch error handling
        res.status(403);
        return res.json({
            success:false,
            message:"Only staff permission can update the movie",
        })
    }
})





//delete the movie
router.delete("/deleteByName/:name", async(req,res)=>{
    let {name} = req.params;
    console.log(name);
    let movie = await Movie.findOne({name});
    console.log(name);
    if(!name){//find the movie is that exist
        res.status(404);
        return res.json({
            success:false,
            message:"Not found the movie! Please typing the other name.",
        });
    }
    //if the movie exist , it process the delete action
    if(movie!=null){
        Movie.deleteOne({name},{
            new:true,
            runValidators:true,
        }).then((error)=>{
            res.status(200);
            res.send("The movie have been deleted!");
        }).catch(error=>{
            res.send({
                success:true,
                message:error,
            })
        })
    }else{
        //error catching
        res.status(403);
        return res.json({
            success:false,
            message:"Only staff permission can deleted the movie",
        })
    }
})


/**
 * @swagger
 * tags:
 *   name: Moives
 *   description: The movie managing API
 */

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Returns the list of all the movies
 *     tags: [Moives]
 *     responses:
 *       200:
 *         description: The list of the movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/movies'
 */


/**
 * @swagger
 * /api/movies/findByName/{name}:
 *   get:
 *     summary: Get the movie by name
 *     tags: [Moives]
 *     parameters:
 *       - in: path
 *         name: title
 *         schema:
 *           type: string
 *         required: true
 *         description: The movie title
 *     responses:
 *       200:
 *         description: The movie description by title
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/movies'
 *       500:
 *         description: The movie was not found
 */

/**
 * @swagger
 * /api/movies/staff/{_staff_id}:
 *   get:
 *     summary: Get the staff created movie by id
 *     tags: [Moives]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The staff id
 *     responses:
 *       200:
 *         description: The staff description by created movie
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/movies'
 *       500:
 *         description: Cannot get movie data
 */



/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Moives]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/movies'
 *     responses:
 *       200:
 *         description: New movie has been saved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/movies'
 *       400:
 *         description: Cannot save movie Only staff can post new movie or some error

 */


/**
 * @swagger
 * /api/movies/{_id}:
 *  patch:
 *    summary: Update the movie by the id
 *    tags: [Moives]
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
 *            $ref: '#/components/schemas/movies'
 *    responses:
 *      200:
 *        description: The movie was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/movies'
 *      403:
 *        description: Only staff permission can update the movie
 *      404:
 *        description: Movie not found
 */


/**
 * @swagger
 * /api/movies/deleteByName/{id}:
 *   delete:
 *     summary: Remove the movie by title
 *     tags: [Moives]
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
 *         description: The movie was deleted
 *       403:
 *         description: Only staff permission can deleted the movie
 *       404:
 *         description: The movie not found , Please typing the other name
 */



module.exports = router;