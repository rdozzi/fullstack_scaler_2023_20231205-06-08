/** Authentication Relatted Handlers */

const userModel = require("../model/userModel"); 
const jwt = require("jsonwebtoken")
const { SECRET_KEY } = process.env
const {emailBuilder} = require("../nodemailer")

const otpGenerator = () => {
    return Math.floor(100000 * Math.random() * 900000)
}

const signupHandler = async function (req, res) {
    try {
      // add it to the db
      const userObject = req.body;
      //   data -> req.body
      let newUser = await UserModel.create(userObject);
      // send a response
      res.status(201).json({
        message: "user created successfully",
        user: newUser,
        status: "success",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.message,
        status: "success",
      });
    }
};

const loginHandler = async function (req, res) {
    try {
      let { email, password } = req.body;
      let user = await UserModel.findOne({ email });
      if (user) {
        let areEqual = password == user.password;
        if (areEqual) {
          // user is authenticated
          /* 2. Sending the token -> people remember them
           * */
          // payload : id of that user
          jwt.sign(
            { id: user["_id"] },
            SECRET_KEY,
            { expiresIn: "1h" },
            function (err, data) {
              if (err) {
                throw new Error(err.message);
              }
              res.cookie("token", data, {
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: true,
              });
              res.status(200).json({ status: "success", message: data, user: user });
            }
          );
        } else {
          console.log("err", err);
          res.status(404).json({
            status: "failure",
            message: "email or password is incorrect",
          });
        }
      } else {
        res.status(404).json({
          status: "failure",
          message: "user not found",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "failure",
        message: err.message,
      });
    }
};

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

const protectRoute = async (req, res, next) => {
    // get token from cookies
    // verify token
    // get user from database
    // if user exists then call next
    try {
      const token = req.cookies.token;
      const decoded = jwt.verify(token, SECRET);
      if (decoded) {
        const userId = decoded.id;
        req.userId = userId;
        next();
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "failure",
        message: err.message,
      });
    }
  };

  const isAdmin = async (req, res, next) => {
    // get userId from req.userId
    // authorise user to see the user data
    // get user from database
    // if user.role === "admin" then call next
    const userId = req.userId;
    const user = await User.findById(userId);
    if (user.role === "admin") {
      next();
    } else {
      res.status(403).json({
        status: "failure",
        message: "only admins can perform this action",
      });
    }
  };