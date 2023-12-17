const express = require("express")

const app = express()

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
    res.json({
        message: "Welcome to the products page",
    })
})

app.get('/clearCookie',(req,res) => {
    res.json({
        message: "Welcome to the clearCookie page",
    })
})

app.listen( 3000, () => {
    console.log('Server is listening on port 3000')
})