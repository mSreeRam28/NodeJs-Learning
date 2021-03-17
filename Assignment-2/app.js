const express = require('express');

const app = express();

// app.use((req, res, next) => {
//     console.log('In Middleware 1');
//     next();
// });

// app.use((req, res, next) => {
//     console.log('In Middleware 2');
//     res.send('Hello');
// });

app.use('/users', (req, res, next) => {
    res.send(`
        <ul>
            <li>User 1</li>
            <li>User 2</li>
        </ul>
    `);
});

app.use('/', (req, res, next) => {
    res.send(`<h1>Welcome</h1>`);
});

app.listen(3000);