# node-proxy-switcher
conditional proxy switcher supporting WebSockets

## Run
> yarn start

## API
- `port` (default: 5050) - the port the proxy is running
- `logging` (default: false) - enable logging of requests
- `primary` - options of the primary target proxy https://github.com/http-party/node-http-proxy#options
- `secondary` - options of the secondary target proxy https://github.com/http-party/node-http-proxy#options
- `switcher` - conditional check which target to use (primary/secondary)
- `onRequest` - modifying primary request, helpful to modify headers to avoid CORS 