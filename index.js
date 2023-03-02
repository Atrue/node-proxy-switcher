const urlParse = require('url-parse');
const proxySwitcher = require('./proxy');

const proxyHost = 'https://google.com/';
const sessionId = '';

const serverUrl = urlParse(proxyHost);

proxySwitcher({
  port: 5001,
  logging: false,
  primary: { target: proxyHost, ws: true, secure: true, changeOrigin: true, },
  secondary: { target: 'http://localhost:3000' },
  switcher: ({ url }) => url.startsWith('/api/'),
  onRequest(proxyReq, req, res, options) {
    proxyReq.hostname = serverUrl.hostname;
    proxyReq.setHeader('host', serverUrl.host);
    proxyReq.setHeader('origin', serverUrl.origin);
    proxyReq.setHeader('cookie', `_session_id=${sessionId}`);
  }
});
