const express = require("express")

const userRouter = express.Router()

const {getUserHandler,
    createUserHandler,
    getUserByIdHandler,
    updateUserByIdHandler,
    deleteUserByIdHandler,} = require("../controller/userController")
const {checkInput} = require("../utils/crudFactory")

userRouter.get('/',getUserHandler)
userRouter.post('/', checkInput, createUserHandler)
userRouter.get('/:id',getUserByIdHandler)
userRouter.patch('/:id',updateUserByIdHandler)
userRouter.delete('/:id',deleteUserByIdHandler)