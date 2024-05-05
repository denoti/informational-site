const http = require('http');
const fs = require('fs');
const path = require('path');
// const { dir } = require('console');

const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer((req, res) => {
  // Set the default file path
  let filePath = path.join(
    __dirname,
    'public',
    req.url === '/' ? 'index.html' : req.url
  );
  // Fix file pth issue if it has no extension
  const extname = path.extname(filePath);
  if (!extname) filePath += '.html'; // Assuming the default extension is .html

  // Set content type based on file extension
  let contentType = 'text/html'; // Default content-type is text/html
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
  }

  // Read and serve the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code == 'ENOENT') {
        // File not found, serve a 404 page
        fs.readFile(
          path.join(__dirname, 'public', '404.html'),
          (err, content) => {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        );
      } else {
        //   Some server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      //   Successfully read the file
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
