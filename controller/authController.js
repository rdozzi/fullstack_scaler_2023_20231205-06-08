/** Authentication Relatted Handlers */

const userModel = require("../model/userModel"); 
const jwt = require("jsonwebtoken")
const { SECRET_KEY } = process.env

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
  