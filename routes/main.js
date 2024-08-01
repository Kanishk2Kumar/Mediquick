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
router.get('/', async (req, res) => {
  if (IsAdmin) {
    try {
      const users = await User.find(); 
      console.log(users);
      res.render('admin', { users }); // Render the 'admin' template and pass the user data
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
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

router.get("/Admin/AllUsers", async (req, res) => {
  if (IsAdmin) {
    try {
      const users = await User.find();
      res.render("AllUsers", {users});
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.redirect("/login");
  }
});
// Add Products
router.post('/AddProduct', upload.single('image'), async (req, res) => {
  try {
      const { title, description, use, price, rentalPrice, categories } = req.body;

      // Debug logging
      console.log('Received data:', req.body);
      console.log('File info:', req.file);

      // Validate required fields
      if (!title || !description || !price || !rentalPrice) {
          return res.status(400).send('Missing required fields');
      }

      // Convert price and rentalPrice to numbers
      const parsedPrice = parseFloat(price);
      const parsedRentalPrice = parseFloat(rentalPrice);

      // Check if parsed values are valid numbers
      if (isNaN(parsedPrice) || isNaN(parsedRentalPrice)) {
          return res.status(400).send('Invalid price or rentalPrice');
      }

      // Convert categories to an array if it’s a comma-separated string
      const categoryArray = categories ? categories.split(',').map(category => category.trim()) : [];

      // Create a new product
      const product = new Product({
          title,
          description,
          use,
          image: req.file ? req.file.path : '', // Save file path
          categories: categoryArray,
          price: parsedPrice,
          rentalPrice: parsedRentalPrice,
          createdAt: new Date(),
          inStock: true
      });

      // Save the product
      await product.save();
      res.status(201).send('Product added successfully');
  } catch (err) {
      console.error('Error adding product:', err);
      res.status(400).send('Error adding product');
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

// Search Route
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q; // Get search query from the request
        const products = await Product.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }, 
                { description: { $regex: query, $options: 'i' } },
                { categories: { $regex: query, $options: 'i' } }
            ]
        });

        res.render('Products', { products }); // Render the Products view with search results
    } catch (error) {
        console.error('Error performing search:', error);
        res.status(500).send('Server Error');
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
router.get("/editProfile/:id", async (req, res) => {
  if (SignedIn) {
    try {
      const user = await User.findById(req.params.id);
      console.log("Edit Profile Main: "+ user);
      res.render("editProfile", { user });
    } catch (err) {
      res.status(500).json(err);
    }
  } else{
    res.redirect("/login");
  }
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
