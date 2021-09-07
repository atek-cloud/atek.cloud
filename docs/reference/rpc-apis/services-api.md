# Services Control and Management API

`atek.cloud/services-api`

```
npm i @atek-cloud/services-api
```

```typescript
import services from '@atek-cloud/services-api'

await services.list() // => {services: [...]}
```

The API:

```typescript
interface ServicesApi {
  // List all installed services.
  list (): Promise<{services: ServiceInfo[]}>

  // Fetch information about an installed service.
  get (id: string): Promise<ServiceInfo>

  // Install a new service.
  install (opts: InstallOpts): Promise<ServiceInfo>

  // Uninstall a service.
  uninstall (id: string): Promise<void>

  // Change the settings of a service.
  configure (id: string, opts: ConfigureOpts): Promise<void>

  // Start a service process.
  start (id: string): Promise<void>

  // Stop a service process.
  stop (id: string): Promise<void>

  // Restart a service process.
  restart (id: string): Promise<void>

  // Query the source package for software updates.
  checkForPackageUpdates (id: string): Promise<{hasUpdate: boolean, installedVersion: string, latestVersion: string}>

  // Update the service to the highest version which matches "desiredVersion".
  updatePackage (id: string): Promise<{installedVersion: string, oldVersion: string}>
}
```