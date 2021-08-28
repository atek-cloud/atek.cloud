---
sidebar_position: 1
---

# Account Session API

`atek.cloud/account-session-api`

This API is used by the host environment to manage HTTP sessions with the GUI.

```typescript
/*
id: atek.cloud/account-session-api
type: api
title: Account Session API
description: This API is used by the host environment to manage HTTP sessions with the GUI.
*/

export default interface AccountSessionApi {
  // Get the user account attached to the current session cookie.
  whoami (): Promise<WhoamiResponse>

  // Create a new session.
  login (opts: {username: string, password: string}): Promise<void>

  // Destroy the current session.
  logout (): Promise<void>
}

interface WhoamiResponse {
  hasSession: boolean
  account?: {
    id: string
    username: string
  }
}
```
