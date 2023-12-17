const express = require("express")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")

// Parse cookie header and populate req.cookies with an object key

const app = express()
app.use(cookieParser())

require("dotenv").config()

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
            process.env.SECRET_KEY,
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

app.listen( 3000, () => {
    console.log('Server is listening on port 3000')
})