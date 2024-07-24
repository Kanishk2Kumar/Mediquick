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
    createdAt: {
        type: Date,
        default: Date.now
    },
    inStock: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', productSchema);