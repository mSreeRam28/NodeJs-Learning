const express = require('express');

const homeRouter = require('./routes/home');
const usersRouter = require('./routes/users');

const app = express();

app.use(usersRouter);
app.use(homeRouter);

app.listen(3000);