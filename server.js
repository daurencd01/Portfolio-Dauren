// Local Development Server for KD_SEC Portfolio & Security Tools
// Serves static frontend files and emulates Vercel Serverless API functions (/api/*)
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '3000', 10);
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8'
};

function enrichResponse(res) {
  res.status = function(statusCode) {
    res.statusCode = statusCode;
    return res;
  };

  res.json = function(data) {
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    res.end(JSON.stringify(data));
    return res;
  };

  res.send = function(data) {
    if (typeof data === 'object' && !Buffer.isBuffer(data)) {
      return res.json(data);
    }
    res.end(data);
    return res;
  };
}

const server = http.createServer(async (req, res) => {
  enrichResponse(res);

  // Apply default security headers from vercel.json
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  let parsedUrl;
  try {
    parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:' + PORT}`);
  } catch {
    res.status(400).send('Bad Request');
    return;
  }

  // Parse query parameters into req.query
  const query = {};
  for (const [key, value] of parsedUrl.searchParams.entries()) {
    if (query[key] !== undefined) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  req.query = query;

  const pathname = decodeURIComponent(parsedUrl.pathname);

  // Route API requests (/api/*)
  if (pathname.startsWith('/api/')) {
    const apiName = pathname.slice('/api/'.length).replace(/\.js$/, '');
    const apiFile = path.join(__dirname, 'api', `${apiName}.js`);

    if (fs.existsSync(apiFile)) {
      try {
        // Read body if POST/PUT
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const rawBody = Buffer.concat(chunks).toString();
          try {
            req.body = JSON.parse(rawBody);
          } catch {
            req.body = rawBody;
          }
        }

        // Fresh require for hot reload during dev
        delete require.cache[require.resolve(apiFile)];
        const handler = require(apiFile);
        const fn = typeof handler === 'function' ? handler : handler.default;

        if (typeof fn === 'function') {
          await fn(req, res);
          return;
        }
      } catch (err) {
        console.error(`[API Error] ${pathname}:`, err);
        if (!res.writableEnded) {
          res.status(500).json({ error: err.message || 'Internal API Error' });
        }
        return;
      }
    }

    res.status(404).json({ error: 'API route not found' });
    return;
  }

  // Route Static Files
  let relativePath = pathname.replace(/^\/+/, '');
  if (!relativePath) {
    relativePath = 'index.html';
  }

  let filePath = path.join(PUBLIC_DIR, relativePath);

  // Security check: ensure path is within PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.status(403).send('Forbidden');
    return;
  }

  // Check direct file or directory
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } else if (fs.existsSync(filePath + '.html')) {
    // Support clean URLs like /scanner -> scanner.html
    filePath = filePath + '.html';
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // 404 fallback
  res.status(404).setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end('<h1>404 Not Found</h1><p>The requested file does not exist.</p>');
});

server.listen(PORT, () => {
  console.log('====================================================');
  console.log(`  KD_SEC Local Dev Server running at:`);
  console.log(`  ➜ Main Portfolio:  http://localhost:${PORT}/`);
  console.log(`  ➜ Security Scanner: http://localhost:${PORT}/scanner.html`);
  console.log(`  ➜ OSINT Lookup:    http://localhost:${PORT}/osint.html`);
  console.log(`  ➜ Exposure Check:  http://localhost:${PORT}/exposure.html`);
  console.log('====================================================');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const nextPort = PORT + 1;
    console.warn(`[!] Port ${PORT} is in use, trying port ${nextPort}...`);
    server.listen(nextPort);
  } else {
    console.error('Server error:', err);
  }
});
