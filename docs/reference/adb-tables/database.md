# Database

`atek.cloud/database`

Settings and cached state for a database.

```typescript
interface Database {
  dbId: string
  cachedMeta?: {
    displayName?: string
    writable?: boolean
  }
  network?: {
    access?: NetworkAccess
  }
  services?: ServiceConfig[]
  createdBy?: {
    accountId?: string
    serviceKey?: string
  }
  createdAt: Date
}

interface ServiceConfig {
  serviceKey: string
  alias?: string
  persist?: boolean
  presync?: boolean
}

enum NetworkAccess {
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
