/** Authentication Relatted Handlers */

const userModel = require("../model/userModel"); 

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

