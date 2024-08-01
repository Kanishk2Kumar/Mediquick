const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();
router.get("/EditProducts", async (req, res) => {
  if (IsAdmin) {
  const products = await Product.find();
  res.render("EditProducts", { products });
}else{
  res.status(401).json("You are not authenticated!");
  }
});
// Get Create Product
router.get("/AddProduct", async (req, res) => {
  if (IsAdmin) {
    res.render("AddProducts");
  }else{
    res.status(401).json("You are not authenticated!");
  }
});
//CREATE
router.post("/AddProduct", async (req, res) => { // TESTED
  console.log(req.body)
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.get("/update/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('UpdateProduct', { product });
  } catch (err) {
    res.status(500).json(err);
  }
});
router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => { // TESTED
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/delete/:id", async (req, res) => { // TESTED
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => { // TESTED 
  try {
    const product = await Product.findById(req.params.id);
    res.render('IndividualCard', { product });
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => { // TESTED
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.render('Products', { products });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;