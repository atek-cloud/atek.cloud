---
sidebar_position: 2
---

# Creating APIs

Atek's RPC module is easy to use directly (see [Introduction to Atek RPC](./intro)). However, to help applications stay up-to-date with each others' APIs, we recommend publishing modules which wrap the RPC module with your API definition.

Here is a complete example of an API module using Typescript:

```typescript
import { rpc, createRpcServer } from '@atek-cloud/node-rpc'

// ID of the api
export const ID = 'example.com/my-api'

// Structured types 
export class HelloResponse {
  constructor (public value: string) {}
  static schema = {
    type: 'object',
    properties: {
      value: {type: 'string'}
    }
  }
}

// Client interface
export interface MyApi {
  hello (who: string): Promise<HelloResponse>
}

// Client creator function
export function createClient () {
  return rpc<MyApi>('example.com/my-api')
}

// Server creator function
export function createServer (handlers) {
  return createRpcServer(handlers, {
    // Runtime validation
    hello: {
      params: [{type: 'string'}],
      response: HelloResponse
    }
  })
}

// Default client
export default createClient()
```

Consumers of this api can begin using the default export as if it were a typical JS module:

```typescript
import myApi from 'example-my-api'

await myApi.hello('world')
```

Implementers of a server can use the `createServer` function.

```typescript
import { createServer as createMyApiServer, HelloResponse } from 'example-my-api'

const myApiServer = createMyApiServer({
  hello (who: string): HelloResponse {
    return new HelloResponse(`Hello ${who}`)
  }
})
```

The patterns demonstrated above include both Typescript static type information as well as runtime type validation. Thanks to the types and validators defined in the module, consumers of your API will have a much easier time following the API definition.

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
  // handlers are provided by a consumer of your API
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