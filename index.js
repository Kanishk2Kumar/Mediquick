const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const User = require("./models/User");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const MedicineRoute = require("./routes/Medicines");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const mainRoute = require("./routes/main");

global.SignedIn = false;
global.currentUser_Id = null;
global.username = null;
global.IsAdmin = false;
global.AccessTokenC = null;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log(`Database Connected: ${mongoose.connection.host}:${mongoose.connection.port}`))
  .catch((err) => {
    console.log(err);
  });

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Abhinav Uploads
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function fetchUserDetails(currentUser_Id) {
  try {
    const user = await User.findById(currentUser_Id);
    global.username = user.username;
    console.log(user)
    return user;
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
}

// Serving static files
const static_path = path.join(__dirname, 'public');
app.use(express.static(static_path));

// Templating Engine (EJS)
app.use(expressLayouts);
app.set('view engine', 'ejs');
const templates_path = path.join(__dirname, 'views');
app.set('views', templates_path);

// Auth Route
app.get("/login", (req, res) => {
  res.render("Login", {layout: false});
});

//REGISTER
app.post("/register", async (req, res) => {
  const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
          req.body.password,
          process.env.PASS_SEC
      ).toString(),
      dateOfBirth: req.body.dateOfBirth,
      address: req.body.address
  });

  try {
      const savedUser = await newUser.save();
      SignedIn = true;
      currentUser_Id = savedUser._id.toString(); // Ensure this is a string
      console.log(currentUser_Id);
      await fetchUserDetails(currentUser_Id);
      if(savedUser.isAdmin == true){
        IsAdmin = true;
      }
      
      res.redirect("/");
  } catch (err) {
      res.status(500).json(err);
  }
});
// LOGIN
app.post("/login", async (req, res) => {
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
      console.log(accessToken);
      AccessTokenC = accessToken;
      await fetchUserDetails(currentUser_Id);
      if(user.isAdmin == true){
        IsAdmin = true;
      }
      
      res.redirect("/");
  } catch (err) {
      res.status(500).json(err);
  }
});
// Middleware to set layout
app.use((req, res, next) => {
  if (IsAdmin) {
    app.set('layout', './layouts/admin');
  } else {
    app.set('layout', './layouts/main');
  }
  next();
});
// Routes
app.use("/", mainRoute);
app.use("/users", userRoute);
app.use("/product", productRoute);
app.use("/medicines", MedicineRoute);
app.use("/cart", cartRoute);
app.use("/order", orderRoute);

app.listen(5000, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`);
})