const express = require('express');

const { body, param } = require('express-validator');

const adminController = require('../controllers/admin');

const isAuthenticated = require('../middleware/is-authenticated'); 

const router = express.Router();

const productValidation = [body('title').isString().isLength({min: 2, max: 100}).trim(),
                            body('price').isNumeric(),
                            body('description').isLength({min:2, max: 500})];

const paramValidation = param('productId').exists().isInt().withMessage('Product param must be an Integer');

router.post('/add-product', isAuthenticated.loginAuthentication, isAuthenticated.adminAuthentication, productValidation, adminController.postAddProduct);

router.put('/edit-product/:productId', isAuthenticated.loginAuthentication, isAuthenticated.adminAuthentication, productValidation, paramValidation, adminController.putEditProduct);

router.delete('/delete-product/:productId', isAuthenticated.loginAuthentication, isAuthenticated.adminAuthentication, paramValidation, adminController.deleteProduct);

router.get('/products', isAuthenticated.loginAuthentication, isAuthenticated.adminAuthentication, adminController.getProducts);

module.exports = router;
