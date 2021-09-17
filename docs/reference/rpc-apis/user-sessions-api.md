# User Sessions API

`atek.cloud/user-sessions-api`

```
npm i @atek-cloud/user-sessions-api
```

```typescript
import userSessions from '@atek-cloud/user-sessions-api'

await userSessions.login({username: 'bob', password: 'hunter2'})
await userSessions.whoami() // => {isActive: true, username: 'bob'}
await userSessions.logout()
```

The API:

```typescript
interface UserSessionsApi {
  // Get the current session
  whoami (): Promise<UserSession>

  // Create a new session
  login (creds: UserCreds): Promise<UserSession>

  // End the current session
  logout (): Promise<void>
}
```