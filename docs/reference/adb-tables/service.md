---
sidebar_position: 11
---

# Service

`atek.cloud/service`

Service installed to a host environment.

```typescript
/*
id: atek.cloud/service
type: adb-record
title: Service
description: Service installed to a host environment.
templates:
  table:
    title: Services
    description: Services installed to the host environment.
  record:
    title: "Service \"{{/id}}\", source: {{/sourceUrl}}"
*/

export default interface Service {
  id: string // pattern: "^([a-zA-Z][a-zA-Z0-9-]{1,62}[a-zA-Z0-9])$"
  port: number
  sourceUrl: URL
  desiredVersion?: string
  package: {
    sourceType: SourceTypeEnum
    installedVersion?: string
    title?: string
  }
  manifest?: ServiceManifest
  config?: ServiceConfig
  installedBy: string //  pattern: "^([a-zA-Z][a-zA-Z0-9-]{1,62}[a-zA-Z0-9])$"
}

export interface ServiceManifest {
  name?: string
  description?: string
  author?: string
  license?: string
  exports?: ApiExportDesc[]
}

export interface ApiExportDesc {
  api: string
  path?: string
  transport?: ApiTransportEnum
}

export interface ServiceConfig {
  [key: string]: string
}

export enum SourceTypeEnum {
  file = 'file',
  git = 'git'
}

export enum ApiTransportEnum {
  rpc = 'rpc',
  proxy = 'proxy'
}

```
