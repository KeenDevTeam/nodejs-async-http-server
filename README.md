# Asynchronous wrapper for NodeJS HTTP

Instead of using old-fashioned callback functions to initialize an HTTP server, use promises (Async API).

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]

## Installation

```sh

# NPM
npm i @speedup/async-http-server --save

# Yarn
yarn install @speedup/async-http-server

```

## Usage

### JavaScript

```js

const AsyncHTTPServer = require('@speedup/async-http-server').default;

const instance = new AsyncHTTPServer({
    port: 3000, // it can be a pipe, too
    handler: (req, res) => {} // Any request-handler compatible function
});

// Legacy way

instance.start({
    port: 4000, // you can override it here
    handler: (req, res) => {} // you can override the handler as well.
})
.then(asyncServer => {

    console.info('HTTP server started!');
})
.catch(err => {

    console.error('Failed to start HTTP server', err);
    process.exit(1);
});

// Modern way

try {
    await instance.start({
        port: 4000, // you can override it here
        handler: (req, res) => {} // you can override the handler as well.
    });
}
catch(err) {

    console.error('Failed to start HTTP server', err);
    process.exit(1);
}

```

### TypeScript

```ts

import AsyncHTTPServer from '@speedup/async-http-server';

const instance = new AsyncHTTPServer({
    port: 3000, // it can be a pipe, too
    handler: (req, res) => {} // Any request-handler compatible function
});

// Legacy way

instance.start({
    port: 4000, // you can override it here
    handler: (req, res) => {} // you can override the handler as well.
})
.then(asyncServer => {

    console.info('HTTP server started!');
})
.catch(err => {

    console.error('Failed to start HTTP server', err);
    process.exit(1);
});

// Modern way

try {
    await instance.start({
        port: 4000, // you can override it here
        handler: (req, res) => {} // you can override the handler as well.
    });
}
catch(err) {

    console.error('Failed to start HTTP server', err);
    process.exit(1);
}

```

And you're good to go!

## License

MIT

[npm-image]: https://img.shields.io/npm/v/@speedup/async-http-server.svg?color=orange
[npm-url]: https://npmjs.org/package/@speedup/async-http-server
[downloads-image]: https://img.shields.io/npm/dt/@speedup/async-http-server.svg
[downloads-url]: https://npmjs.org/package/@speedup/async-http-server
