---
sidebar_position: 1
---

# Introduction to ADB

:::warning
ADB is still in development. This document is an overview of the current state of development.
:::

Atek DB is a document-oriented database with:

- Global, peer-to-peer access using [Hypercore Protocol](https://hypercore-protocol.org)
- Strict record schemas
- User-friendly record descriptions
- Computed views and complex queries (*incomplete*)
- Transactional updates (*incomplete*)

ADB is designed for building decentralized applications and draws from experience with Secure Scuttlebutt, Beaker browser, and CTZN (the Atek founder's previous work).

**ADB is still in development and is lacking complex queries, secondary indexes, permissions, computed views, and transactional updates.**

Useful links:

- [ADB API Reference](/docs/reference/rpc-apis/adb-api)

## Overview

ADB's goal is to be easy for users and devs alike as a foundation for decentralized apps. What's interesting about ADB is, databases created on one device can be easily synced to another device while the strict schemas give clear information for interoperation. You can build multi-user applications entirely by sharing databases between devices.

Here's an API overview for ADB:

```typescript
import adb from '@atek-cloud/adb'

// get or create a database under the 'mydb' alias
// - the 'mydb' alias will be stored under this application for easy future access
const db = adb.db('mydb')

// get a database under its Hypercore key
// - if the database does not exist locally, its content will be fetched from the p2p network
const db2 = adb.db('97396e81e407e5ae7a64b375cc54c1fc1a0d417a5a72e2169b5377506e1e3163')
```

Tables are treated as modules to be shared between applications and applied to databases.

```typescript
import posts from 'my-posts-table'

posts(db).create({content: 'Hello, world!'})
await posts(db).list()
```

**Future API** This model gets particularly interesting when databases are shared between users, as we can do merged queries from multiple user databases:

```typescript
// NOTE: the merge() function has not yet been implemented
import posts from 'my-posts-table'
const feed = await posts.merge([db1, db2, db3]).list({limit: 15, reverse: true})
```

**Future API** Computed views will make these kinds of queries more efficient by storing the merged queries to disk:

```typescript
// NOTE: the view API has not yet been implemented
import posts from 'my-posts-table'
import feedView from 'my-feed-view'

// on a private database, create a view of posts from 3 databases
const privateDb = adb.db('app-private-db', {network: false})
feedView(privateDb)
  .table(posts, (view, diff) => {
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

## Defining tables

ADB tables are TS/JS modules which can be reused across multiple applications.

```javascript
import { defineTable } from '@atek-cloud/adb-api`

export default defineTable('example.com/cats', {
  revision: 1,
  definition: {
    type: 'object',
    required: ['id', 'name']
    properties: {
      id: {type: 'string'},
      name: {type: 'string'},
      createdAt: {type: 'string', format: 'date-time'}
    }
  },
  templates: {
    table: {
      title: 'Cats',
      description: 'A table for tracking my cats'
    },
    record: {
      key: '{{/id}}',
      title: 'Kitty: {{/name}}'
    }
  }
})
```

It can then be used on a database:

```javascript
import adb from '@atek-cloud/adb'
import catsTable from 'my-cats-table'

cats(adb.db('mydb')).create({
  id: 'kit',
  name: 'Kit the Cat'
})
```

Let's step through the `defineTable()` parameters.

|Key|Meaning|
|-|-|
|**id**|This identifies the table. It must be a string of the shape `{domain}/{table}`, eg `atek.cloud/account`. A single slash is required in the name (not zero or 2+). The domain name should be a domain which your project owns.|
|**revision**|An integer indicating which revision of the table this is.|
|**definition**|A JSON-Schema definition of the table.|
|**templates.table.title**|A title for the table. Falls back to the schema's title.|
|**templates.table.description**|A description for the table. Falls back to the schema's description.|
|**templates.record.key**|The key that's generated for a record when `create()` is used. Falls back to an autokey.|
|**templates.record.title**|A title for an individual record. Falls back to the raw data.|

### Table ID

The "id" is an important feature, as it identifies the semantics of a table globally. This is why they must have domain-name prefixes, so that applications can correctly identify each others' data. It must be a string of the shape `{domain}/{table}`.

```
example.com/post     - good
atek.cloud/account   - good
post                 - bad, no domain
example.com/db/post  - bad, too many slashes
```

The table id is included in the URLs of record as well:

```
        db-key   table-id         record-key
hyper://1234..af/example.com/post/2021-09-03T20:37:10.323Z
```

As a consequence, we can extract the DB key, table id, and record key from any ADB record's URL.

### Table templates

The "templates" are unusual but quite cool. A moustache-style syntax is available for the `record` templates as json-pointers into an individual record's data. The `record.key` template uses that to define how a record's key is generated.

For example:

```
key: "{{/createdAt}}"
```

Specifies that we'll use the `createdAt` value as the key for a record.

The title and description templates are used in UIs to give a user-friendly description of data. Here's how that is used in Atek's (alpha) frontend:

![record-template](/img/manual/introduction-to-adb/record-template.png)

That record title is generated by the `atek.cloud/service` template, which looks like this:

```
"Service \"{{/id}}\", source: {{/sourceUrl}}"
```

### Table versions

Because Atek applications are not centrally-coordinated, the Atek DB tables must never have breaking changes. Let's say that again:

:::warning
Atek DB tables must never have breaking changes.
:::

If you need to implement breaking changes to your data model, you should create a new table under a new ID. This could include appending a version number, e.g. `example.com/cats.v2`.

If you need to implement a non-breaking change to your table, you can do so by incrementing the `revision` number. This will tell Atek DB to update the table definitions in a database.

### Typescript interfaces

In typescript, you can include an interface so that consumers have access to the correct types:

```typescript
import { defineTable } from '@atek-cloud/adb-api`

interface CatRecord {
  id: string
  name: string
  createdAt: string
}

export default defineTable<CatRecord>('example.com/cats', {
  schema: {
    type: 'object',
    required: ['id', 'name']
    properties: {
      id: {type: 'string'},
      name: {type: 'string'},
      createdAt: {type: 'string', format: 'date-time'}
    }
  },
  templates: {
    table: {
      title: 'Cats',
      description: 'A table for tracking my cats'
    },
    record: {
      key: '{{/id}}',
      title: 'Kitty: {{/name}}'
    }
  }
})
```

The table methods (get, create, list, etc) will use the `CatRecord` interface to describe the parameters and return values.

### Publishing table schemas

There is no automated process for downloading a schema from a table ID. The current recommendation is to publish your tables as NPM modules or similar. Then other developers can reuse your definitions by using your module.

## ADB Databases

ADB's databases are [Hypercore Protocol](https://hypercore-protocol.org) "Hyperbees." This means:

- Every database has a private key which controls who can write to it.
- Every database has a public key which acts as the ID.
- Every record exists under a `hyper://` URL and can be referenced by that URL in the data.
- Every database maintains a history of changes, which enables traveling back to previous states for queries. 

### Network access and caching

When a database is queried, the Hypercore daemon will check the local disk for the record data. If that is not present, it will query the database's known peers for the records and download them automatically. This means that queries may involve network latency. We get around this by presyncing records we know we might need.

### Permissions

The permissions model for Hypercore is that a given database is only readable to people who know its public key. That key is kept secret on Hypercore's network, so it's up to the applications to decide how that key is shared.

A Hypecore database is only writable if you possess the private key. Only one device can write to a database as conflicting writes will corrupt a DB.

Read and write permissions can not be applied at a more fine-grained level (table or row permissions). This means that databases need to be constructed to fit a given security group. The ability to do merged reads from multiple databases will help soften the blow of coarse-grained permissions, as private and shared databases can be read together.

## API reference

[You can find the ADB API reference here.](/docs/reference/rpc-apis/adb-api)