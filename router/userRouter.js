const express = require("express")

const userRouter = express.Router()

const {getUserHandler,
    createUserHandler,
    getUserByIdHandler,
    updateUserByIdHandler,
    deleteUserByIdHandler,
    // forgetPassword, resetPassword,
    } = require("../controller/userController")

const {isAdmin, protectRoute, signupHandler, loginHandler} = require("../controller/authController")

const {checkInput} = require("../utils/crudFactory")

/** User Routes */
userRouter.get('/allUsers', protectRoute, isAdmin, getUserHandler)
userRouter.post('/signup', checkInput, signupHandler)
userRouter.post('/login', checkInput,loginHandler)
userRouter.post('/', checkInput, createUserHandler) //To Delete
userRouter.post('/forgetPassword',forgetPassword)
userRouter.patch('/resetPassword/:userId',resetPassword)
userRouter.get('/:id',getUserByIdHandler)
userRouter.patch('/:id',updateUserByIdHandler)
userRouter.delete('/:id',deleteUserByIdHandler)

module.exports = userRouter