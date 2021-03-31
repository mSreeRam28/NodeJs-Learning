const express = require('express');

const sequelize = require('./util/database');

const helpRoutes = require('./routes/help');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(helpRoutes);

app.use((req, res, next) => {
    res.status(404).send('Page Not Found');
});

app.use((error, req, res, next) => {
    res.status(500).send('Error occured\n ' + error);
});

sequelize
    // .sync({force: true})
    .sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
