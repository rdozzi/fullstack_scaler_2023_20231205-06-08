// const User = require("../models/userModel")


const checkInput = function (req,res,next){
    const details = req.body;
    const isEmpty = Object.keys(details).length === 0
    if(isEmpty){
        res.status(400).json({
            message: "error",
            data: "Input fields cannot be empty"
        })
    } else {
        next();
    }
}

/** Route Handlers */

// Best to make a const function expression to minimize hoisting issues
const getAllFactory = (elementModel) => async function(req,res){
    try{
        const data = await elementModel.find()
        if(data.length === 0){
            throw new Error('No data found')
        } else {
            res.status(200).json({
                message: 'success',
                data: data
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
const createFactory = (elementModel) => async function createUserHandler(req,res){
    try{

        const details = req.body
        const data = await elementModel.create(details)
        res.status(201).json({
            message:"data was created successfully",
            data: data
        })

    } catch(err){
        res.status(500).json({
            message: "error",
            data: err.message
        })
    }
}

const getElementByIdFactory = (elementModel) => async function(req,res){
    // console.log(req.params)
    const {id} = req.params //Deconstruction
    try{
    
        const data = await elementModel.findById(id)
        if(!data){
            throw new Error('No user found!')
        } else {
            res.status(200).json({
                message: "success",
                data: data,
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
const updateElementByIdFactory = (elementModel) => async function(req,res){
    try{
        const {id} = req.params;
        const details = req.body;
        const updatedData = await elementModel.findByIdAndUpdate(id, { $set: details, $inc: {__v: 1} },{
            new: true,
        }) // {new: true} returns object/document after its updated
        if(!updatedData){
            throw new error('No data Found!')
        }else {
            res.status(200).json({
                message: "Data was updated successfully",
                data: updatedData
            });
        }
    }catch(err){
        res.status(500).json({
            message: "error",
            data: err.message
        });
    }
}

const deleteElementByIdFactory = (elementModel) => async function(req,res){
    try{
        const {id} = req.params;
        const deletedData = await elementModel.findByIdAndDelete(id);
        if(!deletedData){
            throw new error('No User Found!')
        }else {
            res.status(200).json({
                message: "Data was deleted successfully",
                data: deletedData
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
    getAllFactory,
    createFactory,
    getElementByIdFactory,
    updateElementByIdFactory,
    deleteElementByIdFactory,
    checkInput
}