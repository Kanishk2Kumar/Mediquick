const Medicine = require("../models/Medicine");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();
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
router.post("/AddMedicine", async (req, res) => { // TESTED
  console.log(req.body);
  const newMedicine = new Medicine(req.body);

  try {
    const savedMedicine = await newMedicine.save();
    res.redirect("/");
  } catch (err) {
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
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => { // TESTED
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