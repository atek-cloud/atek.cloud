# Account Session

`atek.cloud/account-session`

Internal record of a session with a user account.

```typescript
interface AccountSession {
  sessionId: string;
  accountId: string;
  createdAt: string;
}
```

```
npm i @atek-cloud/adb-tables
```

```typescript
import { accountSessions } from '@atek-cloud/adb-tables
```