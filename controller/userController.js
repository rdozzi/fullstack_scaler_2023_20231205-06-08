const User = require("../models/userModel")

/** Route Handlers */

async function getUserHandler(req,res){
    try{
        const userData = await User.find()
        if(userData.length === 0){
            throw new Error('No users found')
        } else {
            res.status(200).json({
                message: 'success',
                data: userData
            })
        }

    }catch(err){
        res.status(500).json({
            message: 'error',
            data: err.message
        })

    }
}

// Update the function to an async function to call user information from the db
// 
async function createUserHandler(req,res){
    try{

        const userDetails = req.body
        const user = await User.create(userDetails)
        res.status(201).json({
            message:"user was created successfully",
            data:user
        })

    } catch(err){
        res.status(500).json({
            message: "error",
            data: err.message
        })
    }
}

async function getUserByIdHandler(req,res){
    console.log(req.params)
    const {id} = req.params //Deconstruction
    try{
    
        const user = await User.findById(id)
        if(!user){
            throw new Error('No user found!')
        } else {
            res.status(200).json({
                message: "success",
                data: user,
            })
        }

    }catch(err){
        res.status(500).json({
            message: "error",
            data: err.message
        })
    }
}

// Recall that interactions are always asynchronous and we need to wait for them. That's why we need async
async function updateUserByIdHandler(req,res){
    try{
        const {id} = req.params;
        const userDetails = req.body;
        const updatedUser = await User.findByIdAndUpdate(id,userDetails,{new: true}) // {new: true} returns object/document after its updated
        if(!updatedUser){
            throw new error('No User Found!')
        }else {
            res.status(200).json({
                message: "User was updated successfully",
                data: updatedUser
            });
        }
    }catch(err){
        res.status(500).json({
            message: "error",
            data: err.message
        });
    }
}

async function deleteUsersByIdHandler(req,res){
    try{
        const {id} = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if(!deletedUser){
            throw new error('No User Found!')
        }else {
            res.status(200).json({
                message: "User was deleted successfully",
                data: deletedUser
            });
        }
    }catch(err){
        res.status(500).json({
            message: "error",
            data: err.message
        });
    }
}

module.exports = {
    getUserHandler,
    createUserHandler,
    getUserByIdHandler,
    updateUserByIdHandler,
    deleteUsersByIdHandler
}