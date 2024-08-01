const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Medicine = require('../models/Medicine');

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

router.get("/EditMedicines", async (req, res) => {
  if (IsAdmin) {
  const Medicines = await Medicine.find();
  res.render("EditMedicines", { Medicines });
}else{
  res.status(401).json("You are not authenticated!");
  }
});
// Get Create Medicine
router.get("/AddMedicine", async (req, res) => {
  if (IsAdmin) {
    res.render("AddMedicine");
  }else{
    res.status(401).json("You are not authenticated!");
  }
});
//CREATE
router.post('/AddMedicine', upload.single('image'), async (req, res) => {
  try {
    console.log(req.body);

    // Extracting the data from the request
    const { title, description, price, categories } = req.body;

    // Validate required fields
    if (!title || !description || !price) {
      return res.status(400).send('Missing required fields');
    }

    // Convert price to a number
    const parsedPrice = parseFloat(price);

    // Check if parsed value is a valid number
    if (isNaN(parsedPrice)) {
      return res.status(400).send('Invalid price');
    }

    // Convert categories to an array if it’s a comma-separated string
    const categoryArray = categories ? categories.split(',').map(category => category.trim()) : [];

    // Create a new medicine
    const newMedicine = new Medicine({
      title,
      description,
      image: req.file ? req.file.path : '', // Save file path
      categories: categoryArray,
      price: parsedPrice,
      createdAt: new Date(),
      inStock: true
    });

    // Save the medicine
    const savedMedicine = await newMedicine.save();
    res.redirect("/");
  } catch (err) {
    console.error('Error adding Medicine:', err);
    res.status(500).json(err);
  }
});

//UPDATE
router.get("/update/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const Medicine = await Medicine.findById(req.params.id);
    res.render('UpdateMedicine', { Medicine });
  } catch (err) {
    res.status(500).json(err);
  }
});
router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => { // TESTED
  try {
    const updatedMedicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedMedicine);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/delete/:id", async (req, res) => { // TESTED
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.status(200).json("Medicine has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET Medicine
router.get("/find/:id", async (req, res) => { // TESTED 
  try {
    const Medicine = await Medicine.findById(req.params.id);
    res.render('IndividualCard', { Medicine });
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL MedicineS
router.get("/", async (req, res) => { // TESTED
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let Medicines;

    if (qNew) {
      Medicines = await Medicine.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      Medicines = await Medicine.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      Medicines = await Medicine.find();
    }

    res.render('Medicines', { Medicines });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;