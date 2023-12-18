const express = require("express")

const userRouter = express.Router()

const {getUserHandler,
    createUserHandler,
    getUserByIdHandler,
    updateUserByIdHandler,
    deleteUserByIdHandler,
    } = require("../controller/userController")

const {isAdmin, 
    protectRoute, 
    signupHandler, 
    loginHandler,
    forgetPassword, 
    resetPassword,} = require("../controller/authController")

const {checkInput} = require("../utils/crudFactory")

/** User Routes */
userRouter.get('/allUsers', protectRoute, isAdmin, getUserHandler)
userRouter.get('/:id',getUserByIdHandler)
userRouter.patch('/:id',updateUserByIdHandler)
userRouter.delete('/:id',deleteUserByIdHandler)

module.exports = userRouter