const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    originalPrice: {
        type: Number, // For sale items
    },
    image: {
        type: String, // URL to image
        required: true
    },
    category: {
        type: String,
        default: 'General'
    },
    isSale: {
        type: Boolean,
        default: false
    },
    stock: {
        type: Number,
        default: 10
    },
    // Premium Fragrance Details
    topNotes: [String],
    heartNotes: [String],
    baseNotes: [String],
    scentFamily: {
        type: String,
        default: 'Floral'
    },
    longevity: {
        type: String,
        default: '6-8 Hours'
    }
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
