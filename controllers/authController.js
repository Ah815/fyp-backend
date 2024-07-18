const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

module.exports = {
  // createUser: async (req, res) => {
  //   const user = req.body;

  //   try {
  //     await admin.auth().getUserByEmail(user.email);
  //     res.status(400).json({ message: "Email already registered" });
  //   } catch (error) {
  //     if (error.code === "auth/user-not-found") {
  //       try {
  //         const userResponse = await admin.auth().createUser({
  //           email: user.email,
  //           password: user.password,
  //           emailVerified: false,
  //           disabled: false,
  //         });
  //         console.log(userResponse.uid);

  //         const newUser = new User({
  //           username: user.username,
  //           email: user.email,
  //           password: CryptoJS.AES.encrypt(
  //             user.password,
  //             process.env.SECRET
  //           ).toString(),
  //           uid: userResponse.uid,
  //           userType: "Client",
  //         });
  //         await newUser.save();
  //         res.status(201).json({ status: true });
  //       } catch (error) {
  //         res.status(500).json({ status: false, error: "Error creating user" });
  //       }
  //     }
  //   }
  // },

   createUser : async (req, res) => {
    const user = req.body;
  
    try {
      // Check if the user already exists in Firebase
      await admin.auth().getUserByEmail(user.email);
      res.status(400).json({ message: "Email already registered" });
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        try {
          // Create the user in Firebase
          const userResponse = await admin.auth().createUser({
            email: user.email,
            password: user.password,
            emailVerified: false,
            disabled: false,
          });
          console.log(userResponse.uid);
  
          // Create the user in MongoDB
          const newUser = await new User({
            username: user.username,
            email: user.email,
            password: CryptoJS.AES.encrypt(
              user.password,
              process.env.SECRET
            ).toString(),
            uid: userResponse.uid,
            
            userType: req.body.userType,
          });
          // userType: "Client",
  
          await newUser.save();
          res.status(201).json({ status: true });
        } catch (mongoError) {
          console.error("Error creating user in MongoDB:", mongoError);
          res.status(500).json({ status: false, error: "Error creating user in MongoDB" });
        }
      } else {
        console.error("Error finding user in Firebase:", error);
        res.status(500).json({ status: false, error: "Error finding user in Firebase" });
      }
    }
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne(
        { email: req.body.email },
        { __v: 0, updatedAt: 0, createdAt: 0, email: 0 }
      );
      !user && res.status(401).json("Wrong Credentials");

      const decryptedpassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET
      );
      const decrypted = decryptedpassword.toString(CryptoJS.enc.Utf8);
      decrypted !== req.body.password && res.status(401).json("Wrong Password");

      const userToken = jwt.sign(
        {
          id: user._id,
          userType: user.userType,
          email: user.email,
        },
        process.env.JWT_SEC,
        { expiresIn: "21d" }
      );

      const { passwaord, email, ...other } = user._doc;
      res.status(200).json({ ...other, userToken });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  },
};
