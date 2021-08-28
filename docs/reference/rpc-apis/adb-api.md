---
sidebar_position: 5
---

# Atek Database API

`atek.cloud/adb-api`



```typescript
/*
id: atek.cloud/adb-api
type: api
title: Atek Database API
*/

export default interface AdbApi {
  // Get metadata and information about a database.
  describe (dbId: string): Promise<DbDescription>

  // Register a table's schema and metadata. 
  table (dbId: string, tableId: string, desc: TableSettings): Promise<TableDescription>

  // List records in a table.
  list (dbId: string, tableId: string, opts?: ListOpts): Promise<{records: Record[]}>

  // Get a record in a table.
  get (dbId: string, tableId: string, key: string): Promise<Record>

  // Add a record to a table.
  create (dbId: string, tableId: string, value: object, blobs?: BlobMap): Promise<Record>

  // Write a record to a table.
  put (dbId: string, tableId: string, key: string, value: object): Promise<Record>
  
  // Delete a record from a table.
  delete (dbId: string, tableId: string, key: string): Promise<void>
  
  // Enumerate the differences between two versions of the database.
  diff (dbId: string, opts: {left: number, right?: number, tableIds?: string[]}): Promise<Diff[]>

  // Get a blob of a record.
  getBlob (dbId: string, tableId: string, key: string, blobName: string): Promise<Blob>
  
  // Write a blob of a record.
  putBlob (dbId: string, tableId: string, key: string, blobName: string, blobValue: BlobDesc): Promise<void>
  
  // Delete a blob of a record.
  delBlob (dbId: string, tableId: string, key: string, blobName: string): Promise<void>

  // Listen for changes to a database.
  subscribe (dbId: string, opts?: {tableIds?: string[]}): DbSubscription
}

export interface DbSubscription {
  emit (name: 'change', evt: Diff)
}

export interface DbDescription {
  dbId: string
  dbType: string
  displayName?: string
  tables: TableDescription[]
}

export interface TableTemplates {
  table?: {
    title?: string
    description?: string
  },
  record?: {
    key?: string
    title?: string
    description?: string
  }
}

export interface TableSettings {
  revision?: number
  templates?: TableTemplates
  definition?: object
}

export interface TableDescription extends TableSettings {
  tableId: string
}

export interface Record {
  key: string
  path: string
  url: string
  seq?: number
  value: object
}

export interface BlobMap {
  [blobName: string]: BlobDesc
}

export interface BlobDesc {
  mimeType?: string
  buf: Uint8Array
}

export interface Blob {
  start: number
  end: number
  mimeType?: string
  buf: Uint8Array
}

export interface Diff {
  left: Record
  right: Record
}

export interface ListOpts {
  lt?: string
  lte?: string
  gt?: string
  gte?: string
  limit?: number
  reverse?: boolean
}
```
