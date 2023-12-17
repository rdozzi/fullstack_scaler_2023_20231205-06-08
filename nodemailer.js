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

const sendEmail = async(mailDetails, callback) => {
    try{
        const info = await transporter.sendMail(mailDetails)
        callback(info)

    }catch(error){
        console.log(error)

    }
}

const HTML_TEMPLATE = (text) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>NodeMailer Email Template</title>
          <style>
            .container {
              width: 100%;
              height: 100%;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .email {
              width: 80%;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
            }
            .email-header {
              background-color: #333;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
            .email-body {
              padding: 20px;
            }
            .email-footer {
              background-color: #333;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email">
              <div class="email-header">
                <h1>OTP for Reset</h1>
              </div>
              <div class="email-body">
                <p>${text}</p>
              </div>
              <div class="email-footer">
                <p>EMAIL FOOTER</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
}

const message = "Hello from Nodemailer. Test Email from RPD"
const options = {
    from: "rdozzi84@gmail.com",
    to: "raphael.dozzi@gmail.com",
    subject: "Send email in Node.js using nodemailer and gmail",
    text: message,
    html: HTML_TEMPLATE(message)
}

sendEmail(options, (info) => {
    console.log("Email sent successfully")
    console.log("Message ID: ", info.messageId)
})

async function emailBuilder(to, subject, text){
    try{
        const options = {
            from:"rdozzi84@gmail.com",
            to:to,
            subject:subject,
            text:text,
            html:HTML_TEMPLATE(text)
        }
        sendEmail(options, (info) => {
            console.log("Email Sent Successfully")
            console.log("Message ID:", info.messageId)
        })
    }catch(error){
        console.log(error)
    }
}

// ayush.raj.sd@gmail.com

module.exports = {
    sendEmail,
    HTML_TEMPLATE,
    emailBuilder,
}