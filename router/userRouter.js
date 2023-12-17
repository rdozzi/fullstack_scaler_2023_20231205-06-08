const express = require("express")

const userRouter = express.Router()

const {getUserHandler,
    createUserHandler,
    getUserByIdHandler,
    updateUserByIdHandler,
    deleteUserByIdHandler,
    forgetPassword,
    resetPassword} = require("../controller/userController")

const {checkInput} = require("../utils/crudFactory")

/** User Routes */
userRouter.get('/',getUserHandler)
userRouter.post('/', checkInput, createUserHandler)
userRouter.post('/forgetPassword',forgetPassword)
userRouter.patch('/resetPassword/:userId',resetPassword)
userRouter.get('/:id',getUserByIdHandler)
userRouter.patch('/:id',updateUserByIdHandler)
userRouter.delete('/:id',deleteUserByIdHandler)

module.exports = userRouter