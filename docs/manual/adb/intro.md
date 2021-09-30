---
sidebar_position: 1
---

# Introduction to ADB

:::warning
ADB is still in development. This document is an overview of the current state of development.
:::

Atek DB is a document-oriented database with:

- Global, peer-to-peer access using [Hypercore Protocol](https://hypercore-protocol.org)
- Optional record schemas
- Computed views and complex queries (*planned*)
- Transactional updates (*planned*)

**ADB is still in development and is lacking complex queries, secondary indexes, permissions, computed views, and transactional updates.**

Useful links:

- [ADB API Reference](/docs/reference/rpc-apis/adb-api)

## Overview

ADB's goal is to be easy for users and devs alike as a foundation for decentralized apps. What's interesting about ADB is, databases created on one device can be easily synced to another device. You can build multi-user applications entirely by sharing databases between devices.

Here's an API overview for ADB:

```typescript
import adb from '@atek-cloud/adb-api'

// get or create a database under the 'mydb' alias
// - the 'mydb' alias will be stored under this application for easy future access
const db = adb.db('mydb')

// get a database under its Hypercore key
// - if the database does not exist locally, its content will be fetched from the p2p network
const db2 = adb.db('97396e81e407e5ae7a64b375cc54c1fc1a0d417a5a72e2169b5377506e1e3163')
```

Records are accessed under paths, similar to a filesystem. All records are JSON.

```typescript
await db.put('/my/stuff/1', {hello: 'world'})
await db.list('/my/stuff') // => {records: [{key: '1', path: '/my/stuff/1', value: {hello: 'world'}}]}
await db.get('/my/stuff/1')  // => {key: '1', path: '/my/stuff/1', value: {hello: 'world'}}

// note that list() is recursive and the key will be set relative to the requested path
await db.list('/') // => {records: [{key: 'my/stuff/1', path: '/my/stuff/1', value: {hello: 'world'}}]}
```

Schemas can be optionally applied to help enforce a specific record shape. Those schemas can be shared as modules.

```typescript
import posts from 'my-posts-schema'

posts(db).create({content: 'Hello, world!'})
await posts(db).list()
```

**Future API** This model gets particularly interesting when databases are shared between users, as we can do merged queries from multiple user databases:

```typescript
// NOTE: the merge() function has not yet been implemented
import posts from 'my-posts-schema'
const feed = await posts.merge([db1, db2, db3]).list({limit: 15, reverse: true})
```

**Future API** Computed views will make these kinds of queries more efficient by storing the merged queries to disk:

```typescript
// NOTE: the view API has not yet been implemented
import posts from 'my-posts-schema'
import feedView from 'my-feed-view'

// on a private database, create a view of posts from 3 databases
const privateDb = adb.db('app-private-db', {network: false})
feedView(privateDb)
  .from(posts, (view, diff) => {
    if (!diff.left && diff.right) {
      // new post
      view.index(diff.right.value.createdAt, view.ptr(diff.right.url))
    } else if (diff.left && !diff.right) {
      // deleted post
      view.deindex(diff.left.value.createdAt, view.ptr(diff.left.url))
    }
  })
  .watch([db1, db2, db3])

// now query the current view state
const feed = await feedView(privateDb).list({limit: 15, reverse: true})
```

## Defining schemas

ADB schemas are TS/JS modules which can be reused across multiple applications. They are entirely optional, but might help keep your software accurate.

```javascript
import { defineSchema } from '@atek-cloud/adb-api`

export default defineSchema('example.com/cats', {
  pkey: '/id',
  jsonSchema: {
    type: 'object',
    required: ['id', 'name']
    properties: {
      id: {type: 'string'},
      name: {type: 'string'},
      createdAt: {type: 'string', format: 'date-time'}
    }
  }
})
```

It can then be used on a database:

```javascript
import adb from '@atek-cloud/adb-api'
import cats from 'my-cats-schema'

cats(adb.db('mydb')).create({
  id: 'kit',
  name: 'Kit the Cat'
})
```

Let's step through the `defineSchema()` parameters.

|Key|Meaning|
|-|-|
|**id**|This sets the path under which keys will be stored and also acts as a kind of identifier for the schema. In the above example, all records would be stored under `/example.com/cats`.|
|**pkey**|The key that's generated for a record when `create()` is used. Falls back to an autokey. The definition should be a string or array of strings, each of which is a json-pointer into the record value.|
|**jsonSchema**|A JSON-Schema definition of the table.|

### Typescript interfaces

In typescript, you can include an interface so that consumers have access to the correct types:

```typescript
import { defineSchema } from '@atek-cloud/adb-api`

interface CatRecord {
  id: string
  name: string
  createdAt: string
}

export default defineSchema<CatRecord>('example.com/cats', {
  pkey: '/id',
  jsonSchema: {
    type: 'object',
    required: ['id', 'name']
    properties: {
      id: {type: 'string'},
      name: {type: 'string'},
      createdAt: {type: 'string', format: 'date-time'}
    }
  }
})
```

The table methods (get, create, list, etc) will use the `CatRecord` interface to describe the parameters and return values.

### Publishing schemas

There is no automated process for downloading a schema. The current recommendation is to publish your tables as NPM modules or similar. Then other developers can reuse your definitions by using your module.

## ADB Databases

ADB's databases are [Hypercore Protocol](https://hypercore-protocol.org) "Hyperbees." This means:

- Every database has a private key which controls who can write to it.
- Every database has a public key which acts as the ID.
- Every record exists under a `hyper://` URL and can be referenced by that URL in the data.
- Every database maintains a history of changes, which enables traveling back to previous states for queries. 

### Network access and caching

When a database is queried, the Hypercore daemon will check the local disk for the record data. If that is not present, it will query the database's known peers for the records and download them automatically. This means that queries may involve network latency. We get around this by presyncing records we know we might need.

### Permissions

The permissions model for Hypercore is that a given database is only readable to people who know its public key. That key is kept secret on Hypercore's network, so it's up to the applications to decide how that key is shared. You can, however, turn off networking on a database via config if it should never leave the device:

```js
adb.db('mydb', {access: 'private'})
```

A Hypecore database is only writable if you possess the private key. Only one device can write to a database as conflicting writes will corrupt a DB.

Read and write permissions can not be applied at a more fine-grained level (table or row permissions). This means that databases need to be constructed to fit a given security group. The ability to do merged reads from multiple databases will help soften the blow of coarse-grained permissions, as private and shared databases can be read together.

## API reference

[You can find the ADB API reference here.](/docs/reference/rpc-apis/adb-api)