const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const User = require("./models/User");
const Order = require("./models/Order"); // Import Order model
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// Import routes
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order"); // Ensure this route is used
const mainRoute = require("./routes/main");

// Global variables
global.SignedIn = false;
global.currentUser_Id = null;
global.username = null;
global.IsAdmin = false;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log(`Database Connected: ${mongoose.connection.host}:${mongoose.connection.port}`))
  .catch((err) => console.log(err));

// Middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Auth Routes
app.get("/login", (req, res) => {
  res.render("login", {layout: false});
});

app.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
  });

  try {
    const savedUser = await newUser.save();
    global.SignedIn = true;
    global.currentUser_Id = savedUser._id.toString(); // Ensure this is a string
    await fetchUserDetails(global.currentUser_Id);
    global.IsAdmin = savedUser.isAdmin;
    res.redirect("/");
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json("Wrong credentials!");
    }

    const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (OriginalPassword !== req.body.password) {
      return res.status(401).json("Wrong credentials!");
    }

    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    global.SignedIn = true;
    global.currentUser_Id = user._id.toString();
    await fetchUserDetails(global.currentUser_Id);
    global.IsAdmin = user.isAdmin;
    
    res.redirect("/");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Middleware to set layout based on user role
app.use((req, res, next) => {
  if (global.IsAdmin) {
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
app.use("/cart", cartRoute);
app.use("/order", orderRoute);

// API Route to get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).send('Error fetching users');
  }
});

// API Route to get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (error) {
    res.status(500).send('Error fetching orders');
  }
});

// Fetch user details
async function fetchUserDetails(currentUser_Id) {
  try {
    const user = await User.findById(currentUser_Id);
    global.username = user.username;
    return user;
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
