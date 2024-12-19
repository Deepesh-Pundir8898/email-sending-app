import express from "express";
import { body, validationResult } from "express-validator";
import nodemailer from "nodemailer";
import bodyParser from 'body-parser';


const app =express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(import.meta.dirname + '/public/form.html');
  });

app.post("/send",
    [
    body("name").notEmpty().withMessage("Name is required").trim().escape(),
    body("email").isEmail().withMessage("Enter a valid email address").normalizeEmail(),
    body("message").notEmpty().withMessage("Message cannot be empty").trim().escape(),
    ] ,
    async(req,res)=>{

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: errors.array(),
            });
        }

        const {name ,email,message} = req.body;
        console.log(name , email,message)

        try {
            const transporter = nodemailer.createTransport({
            service: "gmail", 
            auth: {
                user: "deepeshpundir@gmail.com", 
                pass: "xfgo feag agzw wgpg", 
            },
            });
        
            const mailOptions = {
            from: email,
            to: "deepeshpundir@gmail.com", 
            subject: `Testing mail from ${name}`,
            text: message,
            };
        
            await transporter.sendMail(mailOptions);
        
            res.send("<h1>Message sent successfully! Go back to submit another message.</h1>");
        } catch (error) {
            console.error("Error sending email:", error);
            res.status(500).send("<h1>Failed to send the message. Please try again later.</h1>");
        }

    }
)

const PORT=8080;
app.listen(PORT , ()=>{console.log("Sevrer is starting on PORT :",PORT)})