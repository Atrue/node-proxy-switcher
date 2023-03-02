const http = require('http');
const httpProxy = require('http-proxy');
const express = require('express');
const cookieParser = require('cookie-parser');

module.exports = function proxySwitcher({
  port = 5050,
  primary,
  secondary,
  onRequest = () => {},
  switcher = (req) => true,
  logging = false,
}) {
  // create a server
  const app = express();
  const primaryProxy = httpProxy.createProxyServer(primary);
  const secondaryProxy = httpProxy.createProxyServer(secondary);
  const httpServer = http.createServer(app);

  function log(...args) {
    if (logging) console.log(...args);
  }

  app.use(cookieParser());

  // proxy http
  app.use(function(req, res) {
    const isPrimaryRequest = switcher(req);
    log('proxying', req.method, req.url, isPrimaryRequest);
    if (isPrimaryRequest) {
      primaryProxy.web(req, res, {});
    } else {
      secondaryProxy.web(req, res, {});
    }
  });

  primaryProxy.on('proxyReq', onRequest);
  primaryProxy.on('proxyReqWs', onRequest);
  primaryProxy.on('error', function(err) {
    console.log('error primary proxy', err);
  });

  secondaryProxy.on('error', function(err) {
    console.log('error secondary proxy', err);
  })

  // proxy ws
  httpServer.on('upgrade', function (req, socket, head) {
    const isPrimaryRequest = switcher(req);
    log('proxying websocket', req.method, req.url, isPrimaryRequest);
    if (isPrimaryRequest) {
      primaryProxy.ws(req, socket, head);
    } else {
      secondaryProxy.ws(req, socket, head);
    }
  });

  httpServer.listen(port);
  console.log(`listening localhost:${port}`);
}