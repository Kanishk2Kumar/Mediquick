const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const mainRoute = require("./routes/main");

const session = require('express-session');
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Use true if you are using HTTPS
}));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log(`Database Connected: ${mongoose.connection.host}:${mongoose.connection.port}`))
  .catch((err) => {
    console.log(err);
  });

  
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serving static files
const static_path = path.join(__dirname, 'public');
app.use(express.static(static_path));

// Templating Engine (EJS)
app.use(expressLayouts);
app.set('view engine', 'ejs');
const templates_path = path.join(__dirname, 'views');
app.set('views', templates_path);
// Assuming you have user authentication and role information in req.user
app.use((req, res, next) => {
  req.user = {
      username: 'testAdmin',
      role: "user"
  };
  next();
});
// Middleware to set layout
app.use((req, res, next) => {
    if (req.user && req.user.role === 'admin') {
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

app.listen(5000, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`);
})