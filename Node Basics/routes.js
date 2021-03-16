const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if(url === '/'){
        res.write('<html>');
        res.write('<head><title>Enter a message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"/><button type="submit">Send</button></form></body>');
        res.write('</html>');
        res.end();
        return;
    }

    if(url === '/message' && method === 'POST'){
        const body = [];
        req.on('data', chunk => {
            console.log(chunk);
            body.push(chunk);
        });
        req.on('end', () => {
            const parsedData = Buffer.concat(body).toString();
            console.log(parsedData);
            fs.writeFile('message.txt', parsedData.split('=')[1], err => {
                res.writeHead(302, {'Location' : '/'});
                res.end();
                return;
            });
        });
        return;
    }

    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>First Page</title></head>');
    res.write('<body><h1>Hello from Node.js Response</h1></body>');
    res.write('</html>');
    res.end();
};

module.exports = requestHandler;