const express = require('express');

const { param } = require('express-validator');

const shopController = require('../controllers/shop');

const isAuthenticated = require('../middleware/is-authenticated');

const router = express.Router();

const paramValidation = param('productId').exists().isInt().withMessage('Product param must be an Integer');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', paramValidation, shopController.getProduct);

router.get('/cart', isAuthenticated.loginAuthentication, shopController.getCart);

router.post('/addtocart/:productId', paramValidation, isAuthenticated.loginAuthentication, shopController.postCart);

router.delete('/deletefromcart/:productId', paramValidation, isAuthenticated.loginAuthentication, shopController.deleteCart);

router.get('/orders', isAuthenticated.loginAuthentication, shopController.getOrders);

router.post('/create-order', isAuthenticated.loginAuthentication, shopController.createOrder);

router.get('/checkout', isAuthenticated.loginAuthentication, shopController.getCheckout);

module.exports = router;