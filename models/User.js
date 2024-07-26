const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    // Add Image -> img: { type: String },
    Diagonsis: {
      type: String,
      required: false
    },
    dateOfBirth: { type: Date, required: true }, // Added dateOfBirth field
    address: {
      type: String,
      required: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);