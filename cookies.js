const express = require("express")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const User = require("./models/userModel")

// Parse cookie header and populate req.cookies with an object key

const app = express()
app.use(cookieParser())
app.use(express.json())
require("dotenv").config()

const secretKey = process.env.SECRET_KEY

//home
//products
//clearCookie

app.get('/', (req,res) => {
    res.cookie('pageVisited','home',{maxAge: 1000*60*60*24*7, httpOnly:true} ) 
    // This is how to provide a cookie to a user
    // Cookie time default to 1 ms
    res.json({
        message: "Welcome to the home page",
    })
})

app.get('/products', (req,res) => {
    // console.log(req)
    res.cookie("products","bestSeller",{maxAge: 1000*60*60*24*7, httpOnly: true, path: "/products"})
    console.log(req.cookies)
    
    const {pageVisited} = req.cookies

    if(pageVisited){
        res.json({
            message: "Welcome to the Product Page"
        })
    }else{
        res.json({
            message: "You're visiting for the first time. Please Sign In / Sign Up"
        })
    }
})

app.get('/clearCookie',(req,res) => {
    res.clearCookie("pageVisited", {path: "/"})
    res.json({
        message: "Cookie Cleared",
    })
})

app.get("/signin",(req,res)=>{
    const payload = 1234
    try{
        jwt.sign(
            {data:payload},
            secretKey,
            {expiresIn:'1h'},
            function(err,token){
                if(err){
                    throw new Error("Error Generating Token")
                }
                res.cookie("token",token,{maxAge: 1000*60*60, httpOnly:true,})
                res.json({
                    message: "Token Generated",
                    data:token
                })
            }

        )

    }catch{
        console.log(err)
    }
})

app.get("/verify",(req,res)=>{
    try{
        const{token} = req.cookies
        const decoded = jwt.verify(token,secretKey)
        res.json({
            message:"Token Verified",
            data:decoded
        })
    }catch(err){

    }
})

// signup
// login
// protetcted routes

app.post("/signup",async (req,res)=>{
    // capture the data from the user
    // create the user data on the database
    try {
        const userObject = req.body
        console.log(req.body)
        const user = await User.create(userObject)
        res.json({
            message: "User Created",
            data:user
        })
    }catch(err){
        console.log(err)
    }
})

app.post("/login", async (req,res)=>{
    // create the token
    // send the token to the client
    try{
        // capture the data from the user
        const {email,password} = req.body
        // check the user data on the database
        const user = await User.findOne({email: email})
        console.log("user", user)
        if(!user){
            res.status(400).json({
                message: "User not found"
            })
        }else{
            // check password
            console.log(
                "User Password",
                user.password,
                "Received Password",
                password
            )
            if(user.password != password){
                res.status(400).json({
                    message: "Invalid Credentials"
                })
            }else{
                // create token
                const token = jwt.sign(
                    {data:user._id},
                    secretKey
                )
                res.cookie("token",token,{maxAge: 1000*60*60, httpOnly:true})
                res.json({
                    message:"User Logged In",
                    data:user,
                    token:token
                })
            }
        }
    }catch(err){
        console.log(err)
    }
    
    // check the user data on the database
})

app.listen( 3000, () => {
    console.log('Server is listening on port 3000')
})