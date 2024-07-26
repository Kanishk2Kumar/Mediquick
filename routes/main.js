const User = require("../models/User");
const router = require("express").Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require("./verifyToken");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define the folder to save uploaded images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Save the file with a unique name
  }
});

const upload = multer({ storage });


// Home route
router.get('/', (req, res) => {
  if (IsAdmin) {
    res.render("Admin")
  }else{
    res.render('HomePage');
  }
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
  if (IsAdmin) {
    res.render("Admin")
  }else{
    res.send("You are Not Autheticated");
  }
});
router.get("/Admin/AllUsers", (req, res) => {
  res.render("AllUsers");
});
// Add Products
router.post("/AddProducts", upload.single('image'), async (req, res) => {
  try {
    const categories = req.body.categories.split(',').map(category => category.trim());

    const newProduct = new Product({
      title: req.body.title,
      description: req.body.description,
      use: req.body.use,
      image: req.file.path, // Save the path of the uploaded file
      categories: categories // Assign parsed categories to the product
    });

    const savedProduct = await newProduct.save();
    console.log("Product Added", savedProduct); // Check if categories are saved
    res.status(201).redirect('/Admin'); // Redirect to the admin page or wherever you want
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      console.error(errors);
      res.status(400).send(errors); // Send validation errors as response
    } else {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
});

router.get("/AddProducts", (req, res) => {
  res.render("AddProducts");
});

// router.get("/Products", async (req, res) => {
//   try {
//     const data = await Product.find();
//     res.render('Products', { data });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("An error occurred while fetching the data.");
//   }
// });

// Graphs
router.get("/Revenue", (req, res) => {
  res.render("Revenue");
}); 

// Search
router.get("/search", async (req, res) => {
  try {
    const searchQuery = req.query.q.toLowerCase().trim();
    const posts = await Product.find({
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i' } },
        { categories: { $regex: searchQuery, $options: 'i' } }
      ]
    }).exec();

    res.render('Products', { data: posts });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while searching for posts.");
  }
});
router.get("/IndividualCard", (req, res) => {
  res.render("IndividualCard");
});
// Profile
router.get("/Profile", (req, res) => {
  res.render("Profile");
});

// Edit Profile
router.get("/editProfile", (req, res) => {
  res.render("editProfile");
});

router.post("/editProfile", async (req, res) => {
  // Add your code for editing the profile
});
router.get("/logout", (req, res) => {

    global.SignedIn = false;
    global.currentUser_Id = null;
    global.username = null;

    res.redirect("/");
  });

router.get("/OurTeam", (req, res) => {
  res.render("OurTeam");
});
module.exports = router;
