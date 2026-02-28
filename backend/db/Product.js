const mangoose = require('mongoose');

const productSchema = new mangoose.Schema({
    name: String,
    price: String,
    category: String,
    company: String,
    images: [String],
    userId: String,
    stock: { type: Number, default: 100 },
    discount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: [{
        userId: String,
        userName: String,
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now }
    }],
    views: { type: Number, default: 0 },
    sizes: [String],
    colors: [String],
    description: String,
    brand: String,
    sku: String
}, { timestamps: true });

module.exports = mangoose.model('products', productSchema);