// package.json
// The scripts section can be used to automate processes

// To run your scripts, type "npm run" and then the script of interest

// "start" was added to reduce the need to type "node index.js" every time you want to check your folder

// "run" was added with "nodemon" to automate the code update w/o having to kill and restart every time. This will update the server
// whenever we change index.js.

// To initiate a node project, go to terminal and type npm init -y in your project folder. 
// This will generate a package.json folder and fill in the template with your basic project data.

// To install Express, type npm install (i) express

// To kill a server on Mac, type ^C (Control C)

// To install a package, declare a constant and set it equal to the package preceded by the "require" keyword
const express = require('express')

// To envoke the package, call it like a function
const app = express()

// To be able to capture client data that they send (post) to our app, evoke "app.use(express.json())"
// This will happen every time a client makes a post request

app.use(express.json()) //inbuilt Middleware. Capture all the user request, convert to JSON object, and make that available to us.

// app.use also has a parameter "next" that is used to move to the next middleware type in your code.
app.use((req,res,next) => {
    console.log('middleware')
    next()
})

app.get('/api/user',(req,res) => {
    console.log('get')
    res.json({
        status:200,
        data: {
            name: 'John',
            age: 30
        }
    })
})

app.post('/api/user',(req,res) => {
    console.log(req)
    res.json({
        status:200,
        data: req.body
    })
})


// No matter what request is sent from the client, whatever you write in app.use, it will run.
// You see that 200 is "OK" in Postman
app.use(function(req,res){
    res.status(200).send("Hello World!")
})



// Express provides a listening method that instructss what port user requests will go or should be directed to
app.listen(3000, () => console.log('Listening at 3000'))

