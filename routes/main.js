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
router.get("/WhatWeDo", (req, res) => {
  res.render("WhatWeDo");
});
router.get("/Admin", (req, res) => {
  res.render("Admin");
});
router.get("/Admin/AllUsers", (req, res) => {
  res.render("AllUsers");
});
module.exports = router;
