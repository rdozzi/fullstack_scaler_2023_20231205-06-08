const express = require("express")

const userRouter = express.Router()

const {getUserHandler,
    createUserHandler,
    getUserByIdHandler,
    updateUserByIdHandler,
    deleteUsersByIdHandler,} = require("../controller/userController")
const {checkInput} = require("../utils/crudFactory")

userRouter.get('/',getUserHandler)
userRouter.post('/', checkInput, createUserHandler)
userRouter.get('/:id',getUserByIdHandler)
userRouter.patch('/:id',updateUserByIdHandler)
userRouter.delete('/:id',deleteUsersByIdHandler)