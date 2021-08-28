---
sidebar_position: 9
---

# Atek Inspection API

`atek.cloud/inspect-api`

General debugging information for an endpoint

```typescript
/*
id: atek.cloud/inspect-api
type: api
title: Atek Inspection API
description: General debugging information for an endpoint
*/

export default interface InspectApi {
  isReady (): Promise<boolean>
  getConfig (): Promise<object>
}
```
