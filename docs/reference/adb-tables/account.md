# Account

`atek.cloud/account`

Internal record of user account registration.

```typescript
interface Account {
  username: string
  hashedPassword: string
  role: Role
}

export enum Role {
  none = '',
  admin = 'admin'
}
```

```
npm i @atek-cloud/adb-tables
```

```typescript
import { accounts } from '@atek-cloud/adb-tables
```