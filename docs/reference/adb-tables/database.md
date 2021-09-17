# Database

`atek.cloud/database`

Settings and cached state for a database.

```typescript
interface Database {
  dbId: string
  owningUserKey?: string
  cachedMeta?: {
    displayName?: string
    writable?: boolean
  }
  network?: {
    access?: DatabaseNetworkAccess
  }
  services?: DatabaseServiceConfig[]
  createdBy?: {
    serviceKey?: string
  }
  createdAt: string
}

interface DatabaseServiceConfig {
  serviceKey: string
  alias?: string
  persist?: boolean
  presync?: boolean
}

enum DatabaseNetworkAccess {
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
