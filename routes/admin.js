// const path = require('path');

const express = require('express');

const adminController = require('../controllers/AdminController');
// const rootDir = require('../util/path');

const router = express.Router();

router.get('/add-product', adminController.getAddProduct);

router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.get('/product-list', adminController.getProductList);

router.post('/delete-product', adminController.postDeleteProduct)


module.exports = router;
