const mongoose = require("mongoose");

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
        // required:true, // Removed for forgetPassword
        minlength:8,
        validate: {
            validator: function(){
            return this.password === this.confirmPassword
            },
            message: "Password and Confirm Password should be same."
        }
    },
    token:String,
    otpExpiry:Date,
    role:{
        type:String,
        default:"user"
    },
});

const validRoles = ["admin","user","sales"];

userSchema.pre("save",function(next){
    this.confirmPassword = undefined;
    if(this.role){
        console.log(this.role);
        const isValid = validRoles.includes(this.role);
        if(!isValid){
            throw new Error(`Invalid role ${this.role}`);
        }else{
            next()
        }
    }else{
        this.role = "user";
    }
})

/** Models */
const User = mongoose.model("User",userSchema)

module.exports = User;