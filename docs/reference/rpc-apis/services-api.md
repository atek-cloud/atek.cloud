---
sidebar_position: 12
---

# Services Control and Management API

`atek.cloud/services-api`



```typescript
/*
id: atek.cloud/services-api
type: api
title: Services Control and Management API
*/

// import ServiceRecord from './service' TODO add support for imports

export default interface ServicesApi {
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

  // Subscribe to the service's stdio log.
  subscribe (id: string): LogSubscription
}

export interface LogSubscription {
  emit(name: 'data', evt: {text: string})
}

export interface ServiceInfo {
  status: StatusEnum
  settings: ServiceRecord
}

export enum StatusEnum {
  inactive = 'inactive',
  active = 'active'
}

export interface InstallOpts {
  sourceUrl: URL
  id?: string
  desiredVersion?: string
  port?: number
}

export interface ConfigureOpts {
  id?: string
  sourceUrl?: URL
  desiredVersion?: string
  port?: number
}

export interface ServiceRecord {
  id: string // pattern: "^([a-zA-Z][a-zA-Z0-9-]{1,62}[a-zA-Z0-9])$"
  port: number
  sourceUrl: URL
  desiredVersion?: string
  package: {
    sourceType: SourceTypeEnum
    installedVersion?: string
    title?: string
  }
  manifest?: {
    name?: string
    description?: string
    author?: string
    license?: string
  }
  installedBy: string //  pattern: "^([a-zA-Z][a-zA-Z0-9-]{1,62}[a-zA-Z0-9])$"
}

export enum SourceTypeEnum {
  file = 'file',
  git = 'git'
}
```
