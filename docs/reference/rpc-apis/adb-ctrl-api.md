---
sidebar_position: 6
---

# Atek Database System Control API

`atek.cloud/adb-ctrl-api`



```typescript
/*
id: atek.cloud/adb-ctrl-api
type: api
title: Atek Database System Control API
*/

export default interface AdbCtrlApi {
  // Initialize the ADB process
  init (config: AdbProcessConfig): Promise<void>
  // Get the ADB process configuration
  getConfig (): Promise<AdbProcessConfig>

  // Create a new database
  createDb (opts: DbSettings): Promise<DbInfo>
  // Get or create a database according to an alias. Database aliases are local to each application.
  getOrCreateDb (alias: string, opts: DbSettings): Promise<DbInfo>
  // Configure a database's settings
  configureDb (dbId: string, config: DbSettings): Promise<void>
  // Get a database's settings
  getDbConfig (dbId: string): Promise<DbSettings>
  // List all databases configured to the calling service
  listDbs (): Promise<DbSettings[]>
}

export interface AdbProcessConfig {
  serverDbId: string
}

export interface DbInfo {
  dbId: string
}

export interface DbSettings {
  type?: DbInternalType
  alias?: string // An alias ID for the application to reference the database.
  displayName?: string // The database's display name.
  tables?: string[] // The database's initial configured tables.
  network?: NetworkSettings // The database's network settings.
  persist?: boolean // Does this application want to keep the database in storage?
  presync?: boolean // Does this application want the database to be fetched optimistically from the network?
}

export interface NetworkSettings {
  access?: string
}

export enum DbInternalType {
  HYPERBEE = 'hyperbee'
}
```
