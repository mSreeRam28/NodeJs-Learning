const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/add-product', adminController.getAddProduct);

router.post('/add-product', adminController.postAddProduct);

router.put('/edit-product/:productId', adminController.putEditProduct);

router.delete('/delete-product/:productId', adminController.deleteProduct);

router.get('/products', adminController.getProducts);

module.exports = router;
