
//Aside: To move code up and down in between indented scopes, use option up and down.
//

const express = require('express')
const app = express()

// With this file, we will begin operating on a file system in our folder.
// Evoke file CRUD capabilities with 
const fs = require('fs')

// short-uuid is a node package that can be used to generate IDs
const short = require('short-uuid')

// Import .env package (npm i dotenv)
// Require .env config file to access contents. See syntax with port below
require("dotenv").config()
const mongoose = require('mongoose')

app.use(express.json())
const data = fs.readFileSync('./data.json','utf-8')
const userData = JSON.parse(data)
// console.log(userData)

/** mongodb connection */
mongoose.connect(process.env.DB_URL).then((connection => {
    console.log("Connected to DB")
})).catch((err)=>{
    console.log(err)
})

app.use((req,res,next) => {
    // middleware to check if user sent request with id
    next()
})

/** Schemas */
const userSchema = new mongoose.Schema({
    // Initially we can define these items with a string but we want to add validation checks. Use an object
    // name:String,
    name:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        requires:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
        minlength:10
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    confirmPassword:{
        type:String,
        required:true,
        minlength:8,
        validate: {
            validator: function(){
            return this.password === this.confirmPassword
            },
            message: "Password and Confirm Password should be same."
        }
    }
})

/** Route Handlers */

function getUserHandler(req,res){
    try{
        if(userData.length === 0){
            throw new Error('No Data')
        } else{
            res.status(200).json({
                message: 'success',
                data: userDetails
            })
            
        }
    }catch(err){
        res.status(500).json({
            message: 'error',
            data: err.message
        })

    }
}

function createUserHandler(req,res){
    try{
        const id = short.generate()
        const userDetails = req.body
        userDetails.id = id

        // This can be a bit combersome to write for every post.
        // Use middleware with next statement to check for this in general
        const isEmpty = Object.keys(userDetails).length === 0
        
        
        if(isEmpty){
            throw new Error("No data")
        }
        console.log("userDetails", userDetails)
        userData.push(userDetails)
        fs.writeFile("./data.json", JSON.stringify(userData), (err) => {
            if(err){
                throw new Error("Error writing file")
            }else {
                res.status(200).json({
                    message: "success",
                    data: userDetails
                })
            }
        })
        // res.json({
        //     message: "success",
        //     status: 200,
        //     data: userDetails
        // })

    } catch(err){
        res.status(500).json({
            message: "error",
            data: err.message
        })
    }
}

function getUserByIDHandler (req,res){
    console.log(req.params)
    const {id} = req.params //Deconstruction
    try{
        const user = userData.find((user) => user.id == id)
        console.log("user", user)
        res.status(200).json({
            message: "success",
            data: user
        })
    }catch(err){
        res.status(500).json({
            message: "error",
            data: err.message
        })
    }
}

/** Routes */

app.get('/api/users',getUserHandler)

// (req,res) => {} is the callback function for an event
app.post('/api/users', createUserHandler)

// Here, we are trying to obtain the information for a user with a given ID number that we call
app.get('/api/users/:id', getUserByIDHandler)

app.listen(process.env.PORT, () => console.log(`Listening at ${process.env.PORT}`))