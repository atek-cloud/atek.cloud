---
sidebar_position: 10
---

# Ping API

`atek.cloud/ping-api`

Utility API used for debugging and testing liveness.

```typescript
/*
id: atek.cloud/ping-api
type: api
title: Ping API
description: Utility API used for debugging and testing liveness.
*/

export default interface PingApi {
  // Ask for a pong back with the given parameter
  ping (param: number): Promise<number>
}


```
