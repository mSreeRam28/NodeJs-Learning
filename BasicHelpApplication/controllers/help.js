const Help = require('../model/help');
const { validationResult } = require('express-validator');

exports.getHelp = (req, res, next) => {
    Help.fi
    Help.findAll()
        .then(helpDetails => {
            if(!helpDetails)
                throw new Error('No help details found');
            res.send(helpDetails);
        })
        .catch(err => {
            if(err instanceof Error)
                return next(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.addHelp = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).send('Error in input data\n ' + JSON.stringify(errors));
    }

    const {category, description} = req.body;
    Help.create({
        category: category,
        description: description
    })
    .then(result => {
        if(!result)
            throw new Error('Error adding help details');
        res.send('Added help details successfully');
    })
    .catch(err => {
        if(err instanceof Error)
            return next(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.editHelp = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).send('Error in input data\n ' + JSON.stringify(errors));
    }

    let helpId = req.params.helpId;
    helpId = parseInt(helpId);
    const { category, description } = req.body;
    Help.findByPk(helpId)
        .then(helpDetails => {
            if(!helpDetails)
                throw new Error('Help details not found');
            helpDetails.category = category;
            helpDetails.description = description;
            return helpDetails.save();
        })
        .then(result => {
            res.send('Edited help details successfully');
        })
        .catch(err => {
            if(err instanceof Error)
                return next(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.deleteHelp = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).send('Error in input data\n ' + JSON.stringify(errors));
    }

    let helpId = req.params.helpId;
    helpId = parseInt(helpId);
    Help.findByPk(helpId)
        .then(helpDetails => {
            if(!helpDetails)
                throw new Error('Help details not found');
            return helpDetails.destroy();
        })
        .then(result => {
            if(!result)
                return res.status(500).send('Deletion of help details failed');
            res.send('Help details deleted successfully');
        })
        .catch(err => {
            if(err instanceof Error)
                return next(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};