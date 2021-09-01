---
sidebar_position: 2
---

# Running tests

To write tests for your app, install `@atek-cloud/atek` as a dev dependency.

```
npm i --save-dev @atek-cloud/atek
```

Because Atek is a whole environment which calls your application, we need a simulated version of Atek to run your app.
We create that using `atek.test.startAtek()`.

```js
import * as atek from '@atek-cloud/atek'

// start the simulated Atek
const cfg = new atek.test.Config()
const inst = await atek.test.startAtek(cfg)

// run tests...

// stop the sim
await inst.close()
```

You'll need to tell the simulated Atek to load your service, which you can do like this:

```js
import * as atek from '@atek-cloud/atek'
import * as path from 'path'
import { fileURLToPath } from 'url'

const APP_PATH = path.dirname(fileURLToPath(import.meta.url))

const cfg = new atek.test.Config()
cfg.addCoreService({sourceUrl: `file://${APP_PATH}`}) // <---
const inst = await atek.test.startAtek(cfg)
```

## RPC APIs

You can issue RPC calls in an ad-hoc fashion using the `testInstance.api()` method:

```js
const inspectApi = inst.api('atek.cloud/inspect-api')
const adbApi     = inst.api('atek.cloud/adb-api')
//                      api-id-----^
const activeCfg = await inspectApi('getConfig')
const desc      = await adbApi('describe', [activeCfg.serverDbId])
//                      method-----^    params-----^
```

You can also use Atek's node-rpc by setting the endpoint:

```js
import AdbApiClient from '../src/gen/atek.cloud/adb-api.js'

const adb = new AdbApiClient()
adb.$setEndpoint({port: 10000}) // the test server runs on port 10000 by default
await adb.describe(activeCfg.serverDbId)
```
