const User = require("../models/userModel")

const {checkInput, 
    getAllFactory, 
    createFactory, 
    getElementByIdFactory,
    updateElementByIdFactory,
    deleteElementByIdFactory} = require("../utils/crudFactory")


const { emailBuilder } = require("../nodemailer")

// Called from crudFactory
// const checkInput = function (req,res,next){
//     const userDetails = req.body;
//     const isEmpty = Object.keys(userDetails).length === 0
//     if(isEmpty){
//         res.status(400).json({
//             message: "error",
//             data: "Input fields cannot be empty"
//         })
//     } else {
//         next();
//     }
// }

/** Route Handlers */

// After implementing crudFactory, the function calls will be individualized to each controller model

const getUserHandler = getAllFactory(User)

// async function getUserHandler(req,res){
//     try{
//         const userData = await User.find()
//         if(userData.length === 0){
//             throw new Error('No users found')
//         } else {
//             res.status(200).json({
//                 message: 'success',
//                 data: userData
//             })
//         }

//     }catch(err){
//         res.status(500).json({
//             message: 'error',
//             data: err.message
//         })

//     }
// }

const createUserHandler = createFactory(User)

// Update the function to an async function to call user information from the db

// async function createUserHandler(req,res){
//     try{

//         const userDetails = req.body
//         const user = await User.create(userDetails)
//         res.status(201).json({
//             message:"user was created successfully",
//             data:user
//         })

//     } catch(err){
//         res.status(500).json({
//             message: "error",
//             data: err.message
//         })
//     }
// }

const getUserByIdHandler = getElementByIdFactory(User)

// async function getUserByIdHandler(req,res){
//     console.log(req.params)
//     const {id} = req.params //Deconstruction
//     try{
    
//         const user = await User.findById(id)
//         if(!user){
//             throw new Error('No user found!')
//         } else {
//             res.status(200).json({
//                 message: "success",
//                 data: user,
//             })
//         }

//     }catch(err){
//         res.status(500).json({
//             message: "error",
//             data: err.message
//         })
//     }
// }

const updateUserByIdHandler = updateElementByIdFactory(User)

// Recall that interactions are always asynchronous and we need to wait for them. That's why we need async
// async function updateUserByIdHandler(req,res){
//     try{
//         const {id} = req.params;
//         const userDetails = req.body;
//         const updatedUser = await User.findByIdAndUpdate(id,userDetails,{new: true}) // {new: true} returns object/document after its updated
//         if(!updatedUser){
//             throw new error('No User Found!')
//         }else {
//             res.status(200).json({
//                 message: "User was updated successfully",
//                 data: updatedUser
//             });
//         }
//     }catch(err){
//         res.status(500).json({
//             message: "error",
//             data: err.message
//         });
//     }
// }

const deleteUserByIdHandler = deleteElementByIdFactory(User)

// DeleteUsersByIdHandler
// async function deleteUsersByIdHandler(req,res){
//     try{
//         const {id} = req.params;
//         const deletedUser = await User.findByIdAndDelete(id);
//         if(!deletedUser){
//             throw new error('No User Found!')
//         }else {
//             res.status(200).json({
//                 message: "User was deleted successfully",
//                 data: deletedUser
//             });
//         }
//     }catch(err){
//         res.status(500).json({
//             message: "error",
//             data: err.message
//         });
//     }
// }

const otpGenerator = () => {
    return Math.floor(100000 * Math.random() * 900000)
}

const forgetPassword = async (req,res) => {
    // 2. Find user by email
    // 3. Generate a random token
    // 4. Save token in Database
    // 5. Send email to user with token
    try{
        // 1. Get the email from req.body
        const {email} = req.body
        const user = await User.findOne({email})
        console.log(user.name)
        if(!user){
            return res.status(404).json({
                status:"Fail",
                message:"User is not found"
            })
        }else{
            const token = otpGenerator()
            console.log("Token",token)
            user.token = token
            user.otpExpiry = Date.now() + 5 * 60 * 1000 // 5 minutes

            console.log("Updated user",user)
            await user.save()
            //Send Email to User
            emailBuilder(user.email,"Reset Password",`Your OTP is ${token}`)
            .then( () => {
                console.log("Email sent successfully")
                res.status(200).json({
                    status:"Success",
                    message:"Email sent successfully",
                    data:user
                })
            })
            .catch((error)=>{
                console.log(error)
            })
            res.status(200).json({
                status:"Success",
                message:"Email sent successfully",
                data:user
            })
        }


    }catch(error){

    }
}

const resetPassword = async (req,res) => {
    // 4. Update Password and Confirm Password
    // 5. Save User
    try{
        // 1. Get token from req.body
        // 2. Get password and confirm password from req.body
        const {token,password,email} = req.body
        const {userId} = req.params
        const user = await User.findById(userId)
        if(!user){
            return res.status(400).json({
                status:"Fail",
                message:"User not found"
            })
        }
        // 3. Verify the Validity of Token
        if(user.token !== token){
            return res(400).json({
                status:"fail",
                message:"Invalid Token"
            })
        }else{
            // check expiry time of token
            if(user.otpExpiry < Date.now()){
                return res.status(400).json({
                    status:"Fail",
                    message:"Token Expired"
                })
            }else{
                user.password = password
                user.token = undefined
                user.otpExpiry = undefined
                await user.save()
                res.status(200).json({
                    status:"success",
                    message:"Password updated successfully",
                    data:user
                })
            }
        }

    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getUserHandler,
    createUserHandler,
    getUserByIdHandler,
    updateUserByIdHandler,
    deleteUserByIdHandler,
    checkInput,
    forgetPassword,
    resetPassword,
}