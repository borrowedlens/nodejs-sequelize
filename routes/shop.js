// const path = require('path');

const express = require('express');

const shopController = require('../controllers/ShopController');
// const rootDir = require('../util/path');
// const adminData = require('./admin');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.deleteCartItem);

router.post('/create-order', shopController.postOrder);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

// console.log('shop.js => ', adminData.products);
// res.sendFile(path.join(rootDir, 'views', 'shop.html'));

module.exports = router;
