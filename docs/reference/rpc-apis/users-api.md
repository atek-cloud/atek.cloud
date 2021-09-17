# Users API 

`atek.cloud/users-api`

```
npm i @atek-cloud/users-api
```

```typescript
import users from '@atek-cloud/users-api'

await users.list() // => {users: [...]}
await users.get(user.key) // => {users: [...]}
await users.create({username: 'bob', role: 'admin'})
await users.update(user.key, {role: 'admin'})
await users.delete(user.key, {role: 'admin'})
```

The API:

```typescript
interface UsersApi {
  // List current users
  list (): Promise<{users: User[]}>

  // Get a user
  get (userKey: string): Promise<User>

  // Create a user
  create (user: NewUser): Promise<User>

  // Update a user
  update (userKey: string, user: UserUpdate): Promise<User>

  // Delete a user
  delete (userKey: string): Promise<void>

  // Get a user's settings
  getSettings (userKey: string): Promise<UserSettings>
  
  // Get a user's settings
  updateSettings (userKey: string, settings: UserSettingsUpdate): Promise<UserSettings>
}
```