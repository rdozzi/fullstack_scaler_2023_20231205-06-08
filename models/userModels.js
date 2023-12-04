const mongoose = require('mongoose');

/**
 * Require vs Imports
 * Import is ES6 Module
 * Require is commonjs module
 * Import is done at compile time
 * Require is done at runtime
 */

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

/** Models */
const User = mongoose.model("User",userSchema)

module.exports = User;