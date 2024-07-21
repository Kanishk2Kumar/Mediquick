const User = require("../models/User");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require("./verifyToken");
const session = require('express-session');

global.SignedIn = false;
global.currentUser_Id = null;
global.username = "Kanishk"
// Setup session middleware
router.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Use true if you are using HTTPS
}));
async function fetchUserDetails(currentUser_Id) {
  try {
      const user = await User.findById(currentUser_Id);
      console.log('User Details:', user);
      return user;
  } catch (error) {
      console.error('Error fetching user details:', error);
  }
}
router.get("/", (req, res) => {
    res.render("HomePage",{
      title: 'Home Page',
      description: 'Welcome to our home page.',
  });
});

router.get("/NursingCare", (req, res) => {
  res.render("NursingCare");
});
router.get("/EnquireNow", (req, res) => {
  res.render("EnquireNow");
});
router.get("/Doctor", (req, res) => {
  res.render("DoctorConsultation");
});
router.get("/WhatWeDo", (req, res) => {
  res.render("WhatWeDo");
});
router.get("/Admin", (req, res) => {
  res.render("Admin");
});
router.get("/Admin/AllUsers", (req, res) => {
  res.render("AllUsers");
});
// Auth Route
router.get("/login", (req, res) => {
  res.render("login", {layout: false});
});

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
          req.body.password,
          process.env.PASS_SEC
      ).toString(),
  });

  try {
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
  } catch (err) {
      res.status(500).json(err);
  }
});
// LOGIN
router.post("/login", async (req, res) => {
  try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
          return res.status(401).json("Wrong credentials!");
      }

      const hashedPassword = CryptoJS.AES.decrypt(
          user.password,
          process.env.PASS_SEC
      );
      const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

      if (OriginalPassword !== req.body.password) {
          return res.status(401).json("Wrong credentials!");
      }

      const accessToken = jwt.sign(
          {
            id: user._id,
            isAdmin: user.isAdmin,
          },
          process.env.JWT_SEC,
          { expiresIn: "3d" }
      );

      const { password, ...others } = user._doc;
      SignedIn = true;
      currentUser_Id = user._id.toString(); // Ensure this is a string
      console.log(currentUser_Id);

      await fetchUserDetails("66966ee9bf21c1410b9ce0cb"); // Wait for the user details to be fetched
      res.redirect("/");
  } catch (err) {
      res.status(500).json(err);
  }
});

module.exports = router;
