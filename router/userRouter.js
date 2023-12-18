const express = require("express")

const {getUserHandler,
    getUserByIdHandler,
    updateUserByIdHandler,
    deleteUserByIdHandler,
    } = require("../controller/userController")

const {isAdmin, protectRoute} = require("../controller/authController")

const {checkInput} = require("../utils/crudFactory")

const userRouter = express.Router()
userRouter.use(protectRoute) //add autthentification middleware for all user routes

/** User Routes */
userRouter.get('/allUsers', protectRoute, isAdmin, getUserHandler)
userRouter.get('/:id',getUserByIdHandler)
userRouter.patch('/:id',updateUserByIdHandler)
userRouter.delete('/:id',deleteUserByIdHandler)

module.exports = userRouter