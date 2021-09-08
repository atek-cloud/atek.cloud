---
sidebar_position: 1
---

# Introduction to Atek RPC

![Messaging layer diagram](/img/diagrams/messaging-layer.png)

**Atek uses a centrally-routed RPC architecture.** Applications communicate with Atek's API gateway, which routes the call according to description metadata to the correct destination.

Atek supports two kinds of messaging transports:

- **JSON-RPC**. The standard, structured form of communication between apps.
- **WebSocket**. An open, long-lived socket between apps which can be used for custom protocols.

We've built a [node-rpc module](https://github.com/atek-cloud/node-rpc) to make this easy:

```
npm install @atek-cloud/node-rpc
```

```js
import { rpc, ws } from '@atek-cloud/node-rpc'

// JSON-RPC:
const myApi = rpc('atek.cloud/adb-api')
await myApi.init()

// WebSocket:
const hyperSocket = ws('atek.cloud/hypercore-api')
```

The `rpc()` constructor returns a [Proxy object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) which automatically translates method calls into JSON-RPC requests.

## API modules

We recommend wrapping the RPC module with your API definition, as Atek has done with some of its core APIs:

- [ADB API](https://github.com/atek-cloud/adb-api)
- [Services API](https://github.com/atek-cloud/services-api)
- [Inspection API](https://github.com/atek-cloud/inspect-api)

See the [Creating APIs guide](./creating-apis) for instructions on building shareable API modules.

## Serving APIs

JSON-RPC requests are handled by HTTP POST.

```js
import express from 'express'
import { createRpcServer } from '@atek-cloud/node-rpc'

const myApiServer = createRpcServer({
  hello (who) {
    return {value: `Hello ${who}`}
  }
})
const app = express()
app.use('/_api', express.json())
app.post('/_api/my-api', (req, res) => myApiServer.handle(req, res, req.body))
app.listen(PORT)
```

To tell Atek that the API exists, include a description in your [atek.json manifest file](/docs/reference/manifests).

```json
{
  "exports": [
    {"api": "example.com/my-api", "path": "/_api/my-api"}
  ]
}
```

## Internal mechanics

An outgoing message is sent to the Atek host with the API description enumerated as query parameters:

```js
fetch('http://localhost/_atek/gateway?api=atek.cloud/adb-api', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'}
  body: JSON.stringify({jsonrpc: "2.0", method: "init", params: [], id: 1})
})
```

Because the host server may not have the same port on every machine, the `ATEK_HOST_PORT` environment variable is passed to applications to designate where the RPC calls should go:

```js
const port = process.env.ATEK_HOST_PORT
fetch(`http://localhost:${port}/_atek/gateway?api=atek.cloud/adb-api`, {...})
```

Atek's router currently only uses the API ID. This will expand over time.