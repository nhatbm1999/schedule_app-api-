const express = require('express');
const router = express.Router();

const ProductController = require("../controllers/product_controller");


router.post('/product', ProductController.Create);
module.exports = router;