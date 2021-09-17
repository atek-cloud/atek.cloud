# User

`atek.cloud/user`

Users registered on a Atek server.

```typescript
interface User {
  username: string;
  hashedPassword: string;
  role: Role;
  settings: UserSettings;
}

enum Role {
  none = '',
  admin = 'admin'
}

interface UserSettings {
  mainServiceId: string
}
```

```
npm i @atek-cloud/adb-tables
```

```typescript
import { users } from '@atek-cloud/adb-tables
```