const mangoose = require('mongoose');

const productSchema = new mangoose.Schema({
    name: String,
    price: String,
    category: String,
    company: String,
    image: String,
    userId: String

});

module.exports = mangoose.model('products', productSchema);