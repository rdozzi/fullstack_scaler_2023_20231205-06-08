const Product = require('../models/productModel')

const checkInput = function (req,res,next){
    const productDetails = req.body;
    const isEmpty = Object.keys(productDetails).length === 0
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

async function getProductHandler(req,res){
    try{
        const productData = await Product.find()
        if(productData.length === 0){
            throw new Error('No users found')
        } else {
            res.status(200).json({
                message: 'success',
                data: productData
            })
        }

    }catch(err){
        res.status(500).json({
            message: 'error',
            data: err.message
        })

    }
}

// Update the function to an async function to call product information from the db
// 
async function createProductHandler(req,res){
    try{

        const productDetails = req.body
        const product = await Product.create(productDetails)
        res.status(201).json({
            message:"product was created successfully",
            data:product
        })

    } catch(err){
        res.status(500).json({
            message: "error",
            data: err.message
        })
    }
}

async function getProductByIdHandler(req,res){
    console.log(req.params)
    const {id} = req.params //Deconstruction
    try{
    
        const product = await Product.findById(id)
        if(!product){
            throw new Error('No product found!')
        } else {
            res.status(200).json({
                message: "success",
                data: product,
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
async function updateProductByIdHandler(req,res){
    try{
        const {id} = req.params;
        const productDetails = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(id,productDetails,{new: true}) // {new: true} returns object/document after its updated
        if(!updatedProduct){
            throw new error('No Product Found!')
        }else {
            res.status(200).json({
                message: "Product was updated successfully",
                data: updatedProduct
            });
        }
    }catch(err){
        res.status(500).json({
            message: "error",
            data: err.message
        });
    }
}

async function deleteProductsByIdHandler(req,res){
    try{
        const {id} = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if(!deletedProduct){
            throw new error('No Product Found!')
        }else {
            res.status(200).json({
                message: "Product was deleted successfully",
                data: deletedProduct
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
    getProductHandler,
    createProductHandler,
    getProductByIdHandler,
    updateProductByIdHandler,
    deleteProductsByIdHandler,
    checkInput
}

