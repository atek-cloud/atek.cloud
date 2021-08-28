---
sidebar_position: 13
---

# System API

`atek.cloud/system-api`

General management and configuration APIs for a host environment.

```typescript
/*
id: atek.cloud/system-api
type: api
title: System API
description: General management and configuration APIs for a host environment.
*/

export default interface SystemApi {
  // Enumerate information attached to a "bucket" namespace. This can include databases and other buckets.
  getBucket (bucketId: string): Promise<Bucket>
}

export interface Bucket {
  id: string
  type: BucketTypeEnum
  title: string
  items: BucketChild[]
}

export interface BucketChild {
  id: string
  type: BucketTypeEnum
  title: string
}

export enum BucketTypeEnum {
  root = 'bucket:root',
  app = 'bucket:app',
  trash = 'bucket:trash',
  db = 'db'
}

```
