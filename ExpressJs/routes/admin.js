const express = require('express');

const { body, param } = require('express-validator');

const adminController = require('../controllers/admin');

const router = express.Router();

const productValidation = [body('title').isString().isLength({min: 2, max: 100}).trim(),
                            body('price').isNumeric(),
                            body('description').isLength({min: 2, max: 500})];

const editProductValidation = [body('title').isString().isLength({min: 2, max: 100}).trim().optional(),
                            body('price').isNumeric().optional(),
                            body('description').isLength({min:2, max: 500}).optional()];

const paramValidation = param('productId').exists().isInt().withMessage('Product param must be an Integer');

router.post('/add-product', productValidation, adminController.postAddProduct);

router.put('/edit-product/:productId', editProductValidation, paramValidation, adminController.putEditProduct);

router.delete('/delete-product/:productId', paramValidation, adminController.deleteProduct);

router.get('/products', adminController.getProducts);

module.exports = router;
