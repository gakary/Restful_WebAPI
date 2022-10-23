const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const passport = require("passport");
require("./config/passport");
const movieRoute = require("./routes/movie")
const applicationRoute = require("./routes/application")
const emailRoute = require("./routes/email");

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "WebAPI",
			version: "1.0.0",
			description: "Restful API",
		},
        components: {
            securitySchemes: {
              jwt: {
                type: "http",
                scheme: "bearer",
                in: "header",
                bearerFormat: "JWT"
              },
            }
          }
          ,
		servers: [
			{
				url: "http://localhost:8080",
			},
		],
        security: [{
            jwt: []
          }]
	},
	apis: ["./routes/*.js"],
};




  const specs = swaggerJsdoc(options);

//execute the cors
const cors = require("cors");





//middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use("/api/user", authRoute);
app.use("/api/movies",passport.authenticate("jwt",{session:false}),movieRoute);
app.use("/api/email",emailRoute);
app.use("/api/application",applicationRoute);

//testing API
app.get("/testAPI", (req,res)=>{
    const messageObject = {
        message:"API Running",
    };
    return res.status(200).json(messageObject);
})


