const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if(url === '/'){
        res.write('<html>');
        res.write('<head><title>Users</title></head>');
        res.write('<body><h1>Welcome</h1><form action="/create-user" method="POST"><input type="text" name="username"/><button type="submit">Create</button></form></body>');
        res.write('</html>');
        res.end();
        return;
    }

    if(url === '/users'){
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Users Page</title></head>');
        res.write('<body><ul><li>User 1</li><li>User 2</li></ul></body>');
        res.write('</html>');
        res.end();
        return;
    }

    if(url === '/create-user' && method === 'POST'){
        const body = [];
        req.on('data', chunk => {
            body.push(chunk);
        });
        req.on('end', () => {
            const parsedData = Buffer.concat(body).toString();
            console.log(parsedData.split('=')[1]);
            res.writeHead(302, {'Location' : '/'});
            res.end();
            return;
        });
        return;
    }
};

module.exports = requestHandler;