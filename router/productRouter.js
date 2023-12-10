const express = require("express")

const productRouter = express.Router()

const {getProductHandler,
    createProductHandler,
    getProductByIdHandler,
    updateProductByIdHandler,
    deleteProductByIdHandler,
    } = require("../controller/productController")
const {checkInput} = require("../utils/crudFactory")

/** User Routes */
userRouter.get('/',getProductHandler)
userRouter.post('/', checkInput, createProductHandler)
userRouter.get('/:id',getProductByIdHandler)
userRouter.patch('/:id',updateProductByIdHandler)
userRouter.delete('/:id',deleteProductByIdHandler)

module.exports = productRouter