const Product = require("../models/product_model");
const mongoose = require("mongoose");

exports.Create = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    product_name: req.body.product_name,
    product_image: req.body.product_image,
    product_price: req.body.product_price,
    product_size: req.body.product_size,
    product_quantity: req.body.product_quantity,
    product_details: req.body.product_details,
  });
  product.save().then((result) => {
    console.log(result);
    res.status(200).json({
      success: 1,
      message: "Product created!",
      _id: new mongoose.Types.ObjectId(),
      product_name: req.body.product_name,
      product_image: req.body.product_image,
      product_price: req.body.product_price,
      product_details: req.body.product_details,
    });
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  });
};

exports.Read = (req, res, next) => {
    
}
