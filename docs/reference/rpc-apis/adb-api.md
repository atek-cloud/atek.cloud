# Atek Database API

`atek.cloud/adb-api`

```
npm install @atek-cloud/adb-api
```

```typescript
import adb from '@atek-cloud/adb-api'
import cats from 'example-cats-table'

// get or create a database under the 'mydb' alias
const db = adb.db('mydb')

// use the cats table
await cats(db).create({id: 'kit', name: 'Kit'})
await cats(db).list() // => {records: [{key: 'kit', value: {id: 'kit', name: 'Kit', createdAt: '2021-09-07T01:06:07.487Z'}}]}
await cats(db).get('kit') // => {key: 'kit', value: {id: 'kit', name: 'Kit', createdAt: '2021-09-07T01:06:07.487Z'}}
await cats(db).put('kit', {id: 'kit', name: 'Kitty'})
await cats(db).delete('kit')
```

See [The Atek DB Guide](/docs/manual/adb/intro) to learn how to use ADB.

<a name="modulesmd"></a>

## Default export

| Name | Type |
| :------ | :------ |
| `.api` | `AdbApi` & `AtekRpcClient` |
| `.db` | (`dbId`: `string` \| `DbSettings`, `opts?`: `DbSettings`) => [`AdbDatabase`](#classesadbdatabasemd) |

Use the `.db()` method to create [`AdbDatabase`](#classesadbdatabasemd) instances. You may pass a Hypercore 64-character hex-string key or an arbitrary string (which will be a local alias).

```typescript
import adb from '@atek-cloud/adb-api'

// get or create a database under the 'mydb' alias
// - the 'mydb' alias will be stored under this application for easy future access
const db = adb.db('mydb')

// get a database under its Hypercore key
// - if the database does not exist locally, its content will be fetched from the p2p network
const db2 = adb.db('97396e81e407e5ae7a64b375cc54c1fc1a0d417a5a72e2169b5377506e1e3163')
```

The `.api` is the RPC interface which will be used by `.db()`.

## Functions

### createClient

▸ **createClient**(): `AdbApi` & `AtekRpcClient`

#### Returns

`AdbApi` & `AtekRpcClient`

Use this method to create additional instances of the RPC interface, if needed.

```typescript
import { createClient } from '@atek-cloud/adb-api'

const adbApi = createClient()
// adbApi is another instance of the default export's adb.api
```
___

### createServer

▸ **createServer**(`handlers`): `AtekRpcServer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `handlers` | `any` |

#### Returns

`AtekRpcServer`

Use this method to create an ADB server API. You'll only need this if you're creating an alternative implementation to the main ADB.

___

### defineTable

▸ **defineTable**<`T`\>(`tableId`, `desc`): (`db`: [`AdbDatabase`](#classesadbdatabasemd)) => `any`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `tableId` | `string` |
| `desc` | `TableSettings` |

#### Returns

`fn`

▸ (`db`): [`AdbTable<T>`](#classesadbtablemd)

##### Parameters

| Name | Type |
| :------ | :------ |
| `db` | [`AdbDatabase`](#classesadbdatabasemd) |

##### Returns

[`AdbDatabase`](#classesadbdatabasemd)

Creates a table API which can be called on databases:

```typescript
import adb, { defineTable } from '@atek-cloud/adb-api`

// provide a typescript interface for the records
interface CatRecord {
  id: string
  name: string
  createdAt: string
}

// define the cats table
const catsTable = defineTable<CatRecord>('example.com/cats', {
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

// use the cats table
const db = adb.db('mydb')
await cats(db).create({id: 'kit', name: 'Kit'})
await cats(db).list() // => {records: [{key: 'kit', value: {id: 'kit', name: 'Kit', createdAt: '2021-09-07T01:06:07.487Z'}}]}
await cats(db).get('kit') // => {key: 'kit', value: {id: 'kit', name: 'Kit', createdAt: '2021-09-07T01:06:07.487Z'}}
await cats(db).put('kit', {id: 'kit', name: 'Kitty'})
await cats(db).delete('kit')
```

<a name="classesadbdatabasemd"></a>

## Class: AdbDatabase

- Properties
  - isReady
  - api
  - dbId
- Methods
  - describe
  - define
  - list
  - get
  - create
  - put
  - delete
  - diff
  - getBlob
  - putBlob
  - delBlob

### Constructor

• **new AdbDatabase**(`api`, `dbId`, `opts?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | `AdbApi` |
| `dbId` | `string` |
| `opts?` | `DbSettings` |

### Properties

#### isReady

• **isReady**: `undefined` \| `Promise`<`any`\>

___

#### api

• **api**: `AdbApi`

___

#### dbId

• **dbId**: `string`

### Methods

#### describe

▸ **describe**(): `Promise`<`DbDescription`\>

**`desc`** Get metadata and information about the database.

##### Returns

`Promise`<`DbDescription`\>

___

#### define

▸ **define**(`tableId`, `desc`): `Promise`<`TableDescription`\>

**`desc`** Register a table's schema and metadata.

##### Parameters

| Name | Type |
| :------ | :------ |
| `tableId` | `string` |
| `desc` | `TableSettings` |

##### Returns

`Promise`<`TableDescription`\>

___

#### list

▸ **list**(`tableId`, `opts?`): `Promise`<`Object`\>

**`desc`** List records in a table.

##### Parameters

| Name | Type |
| :------ | :------ |
| `tableId` | `string` |
| `opts?` | `ListOpts` |

##### Returns

`Promise`<`Object`\>

___

#### get

▸ **get**(`tableId`, `key`): `Promise`<`Record`<`object`\>\>

**`desc`** Get a record in a table.

##### Parameters

| Name | Type |
| :------ | :------ |
| `tableId` | `string` |
| `key` | `string` |

##### Returns

`Promise`<`Record`<`object`\>\>

___

#### create

▸ **create**(`tableId`, `value`, `blobs?`): `Promise`<`Record`<`object`\>\>

**`desc`** Add a record to a table.

##### Parameters

| Name | Type |
| :------ | :------ |
| `tableId` | `string` |
| `value` | `object` |
| `blobs?` | `BlobMap` |

##### Returns

`Promise`<`Record`<`object`\>\>

___

#### put

▸ **put**(`tableId`, `key`, `value`): `Promise`<`Record`<`object`\>\>

**`desc`** Write a record to a table.

##### Parameters

| Name | Type |
| :------ | :------ |
| `tableId` | `string` |
| `key` | `string` |
| `value` | `object` |

##### Returns

`Promise`<`Record`<`object`\>\>

___

#### delete

▸ **delete**(`tableId`, `key`): `Promise`<`void`\>

**`desc`** Delete a record from a table.

##### Parameters

| Name | Type |
| :------ | :------ |
| `tableId` | `string` |
| `key` | `string` |

##### Returns

`Promise`<`void`\>

___

#### diff

▸ **diff**(`opts`): `Promise`<`Diff`[]\>

**`desc`** Enumerate the differences between two versions of the database.

##### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Object` |
| `opts.left` | `number` |
| `opts.right?` | `number` |
| `opts.tableIds?` | `string`[] |

##### Returns

`Promise`<`Diff`[]\>

___

#### getBlob

▸ **getBlob**(`tableId`, `key`, `blobName`): `Promise`<`Blob`\>

**`desc`** Get a blob of a record.

##### Parameters

| Name | Type |
| :------ | :------ |
| `tableId` | `string` |
| `key` | `string` |
| `blobName` | `string` |

##### Returns

`Promise`<`Blob`\>

___

#### putBlob

▸ **putBlob**(`tableId`, `key`, `blobName`, `blobValue`): `Promise`<`void`\>

**`desc`** Write a blob of a record.

##### Parameters

| Name | Type |
| :------ | :------ |
| `tableId` | `string` |
| `key` | `string` |
| `blobName` | `string` |
| `blobValue` | `BlobDesc` |

##### Returns

`Promise`<`void`\>

___

#### delBlob

▸ **delBlob**(`tableId`, `key`, `blobName`): `Promise`<`void`\>

**`desc`** Delete a blob of a record.

##### Parameters

| Name | Type |
| :------ | :------ |
| `tableId` | `string` |
| `key` | `string` |
| `blobName` | `string` |

##### Returns

`Promise`<`void`\>


<a name="classesadbtablemd"></a>

## Class: AdbTable<T\>

- Properties
  - isReady
  - db
  - tableId
  - tableDesc
- Methods
  - list
  - get
  - create
  - put
  - delete
  - diff
  - getBlob
  - putBlob
  - delBlob

### Constructor

• **new AdbTable**<`T`\>(`db`, `tableId`, `tableDesc`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `db` | [`AdbDatabase`](#classesadbdatabasemd) |
| `tableId` | `string` |
| `tableDesc` | `TableSettings` |

### Properties

#### isReady

• **isReady**: `Promise`<`any`\>

___

#### db

• **db**: [`AdbDatabase`](#classesadbdatabasemd)

___

#### tableId

• **tableId**: `string`

___

#### tableDesc

• **tableDesc**: `TableSettings`

### Methods

#### list

▸ **list**(`opts?`): `Promise`<`Object`\>

**`desc`** List records in the table.

##### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | `ListOpts` |

##### Returns

`Promise`<`Object`\>

___

#### get

▸ **get**(`key`): `Promise`<`Record`<`T`\>\>

**`desc`** Get a record in the table.

##### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

##### Returns

`Promise`<`Record`<`T`\>\>

___

#### create

▸ **create**(`value`, `blobs?`): `Promise`<`Record`<`T`\>\>

**`desc`** Add a record to the table.

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |
| `blobs?` | `BlobMap` |

##### Returns

`Promise`<`Record`<`T`\>\>

___

#### put

▸ **put**(`key`, `value`): `Promise`<`Record`<`T`\>\>

**`desc`** Write a record to the table.

##### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `T` |

##### Returns

`Promise`<`Record`<`T`\>\>

___

#### delete

▸ **delete**(`key`): `Promise`<`void`\>

**`desc`** Delete a record from the table.

##### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

##### Returns

`Promise`<`void`\>

___

#### diff

▸ **diff**(`opts`): `Promise`<`Diff`[]\>

**`desc`** Enumerate the differences between two versions of the database.

##### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Object` |
| `opts.left` | `number` |
| `opts.right?` | `number` |

##### Returns

`Promise`<`Diff`[]\>

___

#### getBlob

▸ **getBlob**(`key`, `blobName`): `Promise`<`Blob`\>

**`desc`** Get a blob of a record.

##### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `blobName` | `string` |

##### Returns

`Promise`<`Blob`\>

___

#### putBlob

▸ **putBlob**(`key`, `blobName`, `blobValue`): `Promise`<`void`\>

**`desc`** Write a blob of a record.

##### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `blobName` | `string` |
| `blobValue` | `BlobDesc` |

##### Returns

`Promise`<`void`\>

___

#### delBlob

▸ **delBlob**(`key`, `blobName`): `Promise`<`void`\>

**`desc`** Delete a blob of a record.

##### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `blobName` | `string` |

##### Returns

`Promise`<`void`\>

