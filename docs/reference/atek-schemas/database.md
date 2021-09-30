# Database

`atek.cloud/database`

Settings and cached state for a database.

```typescript
interface Database {
  dbId: string
  owner?: {
    userKey?: string
    serviceKey?: string
  }
  cachedMeta?: {
    writable?: boolean
  }
  access?: DatabaseAccess
  alias?: string
  createdAt: string
}

enum DatabaseAccess {
  private = 'private',
  public = 'public'
}
```

```
npm i @atek-cloud/adb-tables
```

```typescript
import { databases } from '@atek-cloud/adb-tables
```
