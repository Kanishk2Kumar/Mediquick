const User = require("../models/User");
const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require("./verifyToken");

router.get("/", (req, res) => {
    res.render("HomePage",{
      title: 'Home Page',
      description: 'Welcome to our home page.',
      headerType: 'header1'  // Apply header1 for homepage
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
router.get("/Admin", (req, res) => {
  res.render("Admin");
});
module.exports = router;
