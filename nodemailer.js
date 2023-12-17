const nodemailer = require("nodemailer")
require("dotenv").config()

// Create Transporter Object

const transporter = nodemailer.createTransport({
    service:"gmail",
    host:"smtp.gmail.com",
    port:587,
    secure:false, // Initialize as false. As you connect, it will upgrade.
    auth:{
        user: "rdozzi84@gmail.com",
        pass: process.env.GOOGLE_PASSWORD
    }
})