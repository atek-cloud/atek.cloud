---
sidebar_position: 4
---

# Accounts API

`atek.cloud/accounts-api`



```typescript
/*
id: atek.cloud/accounts-api
type: api
title: Accounts API
*/

export default interface AccountsApi {
  // Create a new user account.
  create (opts: {username: string, password: string}): Promise<Account>

  // List all user accounts.
  list (): Promise<Account[]>

  // Get a user account by its ID.
  get (id: string): Promise<Account>

  // Get a user account by its username.
  getByUsername (username: string): Promise<Account>
  
  // Delete a user account.
  delete (id: string): Promise<void>
}


export interface Account {
  id: string
  username: string
}
```
