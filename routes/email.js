const router = require("express").Router();
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();


router.post("/",async(req,res)=>{

    const {email,message} = req.body;

    if((email!=null)&&(message!=null)){
        let transporter = nodemailer.createTransport({
            host: "smtppro.zoho.in",
            port: 465,
            secure: true, 
            auth: {
            user: `${process.env.SEND_EMAIL}`, 
            pass: `${process.env.SEND_EMAIL_PW}`, 
            },
        });
        const msg={
            from: '"senderNameSameLikeTheZohoOne" <a104136899@gmail.com>',
            to: `${email}`, 
            subject: "New Enquiry From Film Website!", 
            text: `${message}`,
    
        }
        let info = await transporter.sendMail(msg);
    
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
        res.status(200).send("EMAIL SENT!");
    }else{
        res.status(404).res.send("Invalid input");
    }

    
})




module.exports = router;

