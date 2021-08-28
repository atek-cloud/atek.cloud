---
sidebar_position: 3
---

# Account

`atek.cloud/account`

Internal record of user account registration.

```typescript
/*
id: atek.cloud/account
type: adb-record
title: Account
description: Internal record of user account registration.
templates:
  table:
    title: "Accounts"
    description: "Internal records of user account registrations."
  record:
    key: "{{/username}}"
    title: "System account: {{/username}}"
*/

export default interface Account {
  username: string
  hashedPassword: string
  role: Role
}

export enum Role {
  none = '',
  admin = 'admin'
}

```
