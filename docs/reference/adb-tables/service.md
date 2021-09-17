# Service

`atek.cloud/service`

Service installed to a host environment.

```typescript
interface Service {
  id: string;
  owningUserKey: string;
  sourceUrl: string;
  desiredVersion?: string;
  package: {
      sourceType: SourceTypeEnum
      installedVersion?: string
      title?: string
    };
  manifest?: ServiceManifest;
  config?: ServiceConfig;
}

interface ServiceManifest {
  name?: string;
  description?: string;
  author?: string;
  license?: string;
  exports?: ApiExportDesc[];
}

interface ApiExportDesc {
  api: string;
  path?: string;
  transport?: ApiTransportEnum;
}

interface ServiceConfig {
  [key: string]: string;
}

enum SourceTypeEnum {
  file = 'file',
  git = 'git'
}

enum ApiTransportEnum {
  rpc = 'rpc',
  proxy = 'proxy'
}
```

```
npm i @atek-cloud/adb-tables
```

```typescript
import { services } from '@atek-cloud/adb-tables
```