const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product_name: {type: String, require: true},
    product_image: {type: String, require: true},
    product_price: {type: Number, require: true},
    product_details: {type: String, require: true}
});

module.exports = mongoose.model('Products', productSchema);