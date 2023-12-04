
//Aside: To move code up and down in between indented scopes, use option up and down.
//

const express = require('express')
const app = express()

// With this file, we will begin operating on a file system in our folder.
// Evoke file CRUD capabilities with 
const fs = require('fs')

// short-uuid is a node package that can be used to generate IDs
// const short = require('short-uuid')

// Import .env package (npm i dotenv)
// Require .env config file to access contents. See syntax with port below
require("dotenv").config()
const mongoose = require("mongoose")
const User = require("./models/userModel")
const {getUserHandler, createUserHandler, getUserByIdHandler, updateUserByIdHandler, deleteUsersByIdHandler} = require('./controller/userController')


app.use(express.json())
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

/** Routes */

app.get('/api/users',getUserHandler)

// (req,res) => {} is the callback function for an event
app.post('/api/users', createUserHandler)

// Here, we are trying to obtain the information for a user with a given ID number that we call
app.get('/api/users/:id', getUserByIdHandler)

// We patch instead of put because we want to update only one entry vs the entire object
app.patch("/api/users/:id", updateUserByIdHandler)

app.delete("/api/users/:id", deleteUsersByIdHandler);

app.listen(process.env.PORT, () => console.log(`Listening at ${process.env.PORT}`))