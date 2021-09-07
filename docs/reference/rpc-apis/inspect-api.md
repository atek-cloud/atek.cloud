# Atek Inspection API

`atek.cloud/inspect-api`

General debugging information for an endpoint

```
npm i @atek-cloud/inspect-api
```

```typescript
import inspect from '@atek-cloud/inspect-api'

await inspect.isReady() // => boolean
await inspect.getConfig() // => object
```