const express = require('express');

const { body, param } = require('express-validator');

const helpController = require('../controllers/help');

const router = express.Router();

const helpValidation = [body('category').isString().trim().withMessage('Category must be present and must be a String').exists(),
                        body('description').isString().trim().withMessage('Description must be present and must be a String').exists()];

const paramValidation = param('helpId').isInt().withMessage('Help must be an Integer').exists();

router.get('/help', helpController.getHelp);

router.post('/addhelp', helpValidation, helpController.addHelp);

router.put('/edithelp/:helpId', helpValidation, paramValidation, helpController.editHelp);

router.delete('/deletehelp/:helpId', paramValidation, helpController.deleteHelp);

module.exports = router;