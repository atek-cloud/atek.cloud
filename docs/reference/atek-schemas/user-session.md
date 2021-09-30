# User Session

`atek.cloud/user-session`

Login sessions for users on an Atek server.

```typescript
interface UserSession {
  sessionId: string;
  userKey: string;
  username: string;
  createdAt: string;
}
```

```
npm i @atek-cloud/adb-tables
```

```typescript
import { userSessions } from '@atek-cloud/adb-tables
```