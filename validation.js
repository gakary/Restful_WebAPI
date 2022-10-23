const Joi = require("joi");

//Register Validation , process the register validation
const registerValidation = (data) =>{
    const schema = Joi.object({
        username:Joi.string().min(3).max(50).required(),
        email:Joi.string().min(6).max(50).required().email(),
        password:Joi.string().min(6).max(255).required(),
        role:Joi.string().required().valid("member","staff"),
    })
    return schema.validate(data);
}

const loginValidation = (data) =>{
    const schema = Joi.object({
        email:Joi.string().min(6).max(50).required().email(),
        password:Joi.string().min(6).max(255).required(),
    });
    return schema.validate(data);
}

const applicationValidation = (data) =>{
    const schema = Joi.object({
        movie:Joi.string().min(1).max(20),
        email:Joi.string().min(6).max(50).email(),
        status:Joi.string(),
    })
    return schema.validate(data);
}



//Create movie validation
const movieValidation = (data) =>{
    const schema = Joi.object({
        title: Joi.string().min(6).max(50).required(),
        description: Joi.string().min(6).max(1000).required(),
        price:Joi.number().min(10).max(3000).required(),
    })
    return schema.validate(data);
}

module.exports.applicationValidation = applicationValidation;
module.exports.movieValidation = movieValidation;
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;