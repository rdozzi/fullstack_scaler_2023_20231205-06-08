const express = require("express")
const cookieParser = require("cookie-parser") 
// Parse cookie header and populate req.cookies with an object key

const app = express()
app.use(cookieParser())

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
    res.json({
        message: "Welcome to the clearCookie page",
    })
})

app.listen( 3000, () => {
    console.log('Server is listening on port 3000')
})