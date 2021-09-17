# @atek-cloud/node-rpc

Repo: https://github.com/atek-cloud/node-rpc

RPC library for Atek applications.

```
npm install @atek-cloud/node-rpc
```

## Client

### JSON-RPC

The RPC client is a "proxy object" which automatically translates methods to JSON-RPC calls.
Using it is simple: create an instance with the API metadata (including the API ID) and then call methods on the object.

```javascript
import { rpc } from '@atek-cloud/node-rpc'

const myApi = rpc('example.com/my-api')
await myApi.hello('World') // => {value: 'Hello World'}
```

### Websocket

The Websocket stream is an unopinionated socket to the target service. It should be used when a custom wire protocol is required.

```js
import { ws } from '@atek-cloud/node-rpc'

const socket = ws({api: 'example.com/my-api'})
socket.write(Buffer.from('Hello world', 'utf8'))
```

## Server

Create an RPC server by passing the functions into a server constructor:

```javascript
import { createRpcServer } from '@atek-cloud/node-rpc'

const myApiServer = createRpcServer({
  hello (who) {
    return {value: `Hello ${who}`}
  }
})
```

You handle RPC requests by passing them into the server's handle function:

```javascript
const app = express()
app.use('/_api', express.json())
app.post('/_api/my-api', (req, res) => myApiServer.handle(req, res, req.body))
app.listen(PORT)
```

### Request context

You can access the request, response, and body (which are passed by you into `handle()`) from the `this` of any method handler.

```javascript
import { createRpcServer } from '@atek-cloud/node-rpc'

const myApiServer = createRpcServer({
  someFn () {
    // this.req - The request object
    // this.res - The response object
    // this.body - The body object
  }
})
```

This is particularly useful for handling authentication information which is passed by headers.

## Validation and types

If you would like to add validation to your server, you can pass an object as the second parameter to the constructor which defines the expected params and responses:

```javascript
import { createRpcServer } from '@atek-cloud/node-rpc'

const myApiServer = createRpcServer({
  hello (who) {
    return {value: `Hello ${who}`}
  }
}, {
  hello: {
    params: [{type: 'string'}],
    response: {type: 'object', properties: {value: {type: 'string'}}}
  }
})
```

If you have a class that represents a param or response, set the static `.schema` value on the class and then pass the constructor into the validation config:

```javascript
import { createRpcServer } from '@atek-cloud/node-rpc'

export class HelloResponse {
  constructor (value) {
    this.value = value
  }
  static schema = {
    type: 'object',
    properties: {
      value: {type: 'string'}
    }
  }
}

const myApiServer = createRpcServer({
  hello (who) {
    return {value: `Hello ${who}`}
  }
}, {
  hello: {
    params: [{type: 'string'}],
    response: HelloResponse
  }
})
```

You may want to separate your API server's validation from the actual handler implementation.
(This is recommended for any RPC API as it encourages reuse.)
Here's how you create an API Server "spec" which defines the validation but not the implementation:

```javascript
import { createRpcServer } from '@atek-cloud/node-rpc'

export class HelloResponse {
  constructor (value) {
    this.value = value
  }
  static schema = {
    type: 'object',
    properties: {
      value: {type: 'string'}
    }
  }
}

export function createMyApiServer (handlers) {
  return createRpcServer(handlers, {
    hello: {
      params: [{type: 'string'}],
      response: HelloResponse
    }
  })
}

// to implement:
const myApiServer = createMyApiServer({
  hello (who) {
    return new HelloResponse(`Hello ${who}`)
  }
})
```

If you're using Typescript want to give your client the correct types, you can pass an interface as a type parameter:

```typescript
import { rpc } from '@atek-cloud/node-rpc'

export class HelloResponse {
  constructor (public value: string) {}
  static schema = {
    type: 'object',
    properties: {
      value: {type: 'string'}
    }
  }
}

export interface MyApi {
  hello (who: string): Promise<HelloResponse>
}

export function myApi () {
  return rpc<MyApi>('example.com/my-api')
}
```

## Complete Typescript example

Here is a complete example of an API server and client module in typescript, using the recommended patterns:

```typescript
import { rpc, createRpcServer } from '@atek-cloud/node-rpc'

export const ID = 'example.com/my-api'

export class HelloResponse {
  constructor (public value: string) {}
  static schema = {
    type: 'object',
    properties: {
      value: {type: 'string'}
    }
  }
}

export interface MyApi {
  hello (who: string): Promise<HelloResponse>
}

export function myApi () {
  return rpc<MyApi>('example.com/my-api')
}

export function createMyApiServer (handlers) {
  return createRpcServer(handlers, {
    hello: {
      params: [{type: 'string'}],
      response: HelloResponse
    }
  })
}

export default myApi()
```

Here's how a client can use this:

```typescript
import myApi from '@example-com/my-api'

await myApi.hello('world') // => 'Hello world'
```

And here's how a server can use this:

```typescript
import { createMyApiServer, HelloResponse } from '@example-com/my-api'

const myApiServer = createRpcServer({
  hello (who: string) {
    return new HelloResponse(`Hello ${who}`)
  }
})

const app = express()
app.use('/_api', express.json())
app.post('/_api/my-api', (req, res) => myApiServer.handle(req, res, req.body))
app.listen(PORT)
```

## Configuration

### Set the endpoint

Atek uses an API gateway, which this library will send requests to by default. You can change a client's destination of the API endpoint with `$setEndpoint()`

```javascript
import { client } from '@atek-cloud/node-rpc'

const myApi = client('example.com/my-api')
myApi.$setEndpoint('http://localhost:1234/_api')
```

The API gateway also requires an authorization header. You can change the header with `$setAuthHeader()`

## API

### rpc()

`rpc(apiDesc: string|object, proto = 'http', hostname = 'localhost', port = ATEK_HOST_PORT)`

Create an RPC client. The returned RPC object is a proxy object which automatically translates method-calls to RPC calls.

In typescript, you can set the interface of your RPC API by passing the type:

```typescript
export interface MyApi {
  hello (who: string): Promise<string>
}

const client = rpc<MyApi>('example.com/my-api')
```

### ws()

`ws(apiDesc: string|object, proto = 'ws', hostname = 'localhost', port = ATEK_HOST_PORT)`

Create a websocket stream.

### getUrl()

`getUrl(apiDesc: string|object, proto = 'http', hostname = 'localhost', port = ATEK_HOST_PORT)`

Construct an endpoint URL.

### rpcClient.$setEndpoint()

`rpcClient.$setEndpoint(opts: {proto?: string, hostname?: string, port?: number})`

Set the endpoint for an rpc client.

### `rpcClient.$setAuthHeader(auth: string)`

Set the auth header for an rpc client.

### rpcClient.$url

`rpcClient.$url`

The current endpoint URL of a client.

### rpcClient.$desc

`rpcClient.$desc`

The current api description/metadata of a client, used by atek to route the request.

### `rpcClient.$auth`

The current auth header.

### rpcClient.$rpc()

`rpcClient.$rpc(methodName: string, params: any[] = []): Promise<any>`

Make an RPC call.

### createRpcServer()

`createRpcServer(handlers: AtekRpcServerHandlers, validators?: AtekRpcServerValidators)`

Create an RPC server.

### rpcServer.handle()

`rpcServer.handle(req: http.IncomingRequest, res: http.ServerResponse, body: object)`

Handle an HTTP request.