const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    use: String,
    image: String, 
    categories: [String] ,
    price: {
        type: Number,
        required: true
    },
    rentalPrice: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    inStock: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', productSchema);