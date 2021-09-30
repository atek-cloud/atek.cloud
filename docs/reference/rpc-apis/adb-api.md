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

See [The Atek DB Guide](https://atek.cloud/docs/manual/adb/intro) to learn how to use ADB.

## Default export properties

| Name | Type |
| :------ | :------ |
| `api` | `AdbApi` & `AtekRpcClient` |
| `db` | (`dbId`: `string` \| `DbConfig`, `opts?`: `DbConfig`) => [`AdbDatabase`](#classesadbdatabasemd) |

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

## Exported Functions

### defineSchema

▸ **defineSchema**<`T`\>(`path`, `opts?`): (`db`: [`AdbDatabase`](#classesadbdatabasemd)) => `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` \| `string`[] |
| `opts?` | [`AdbSchemaOpts`](#interfacesadbschemaoptsmd) |

#### Returns

`fn`

▸ (`db`): `any`

Use this function to create reusable record schemas.

```typescript
import adb, { defineSchema } from '@atek-cloud/adb-api`

interface CatRecord {
  id: string
  name: string
  createdAt: string
}

const cats = defineSchema<CatRecord>('example.com/cats', {
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

await cats(adb.db('mydb')).create({
  id: 'kit',
  name: 'Kit the Cat'
})
```

---
### createClient

▸ **createClient**(): `AdbApi` & `AtekRpcClient`

#### Returns

`AdbApi` & `AtekRpcClient`

Creates an `AdbApi` instance. You can typically use the `.api` exported on the default object, but if you need to configure a separate API instance you can use this function.

___

### createServer

▸ **createServer**(`handlers`): `AtekRpcServer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `handlers` | `any` |

#### Returns

`AtekRpcServer`

Creates an `AtekRpcServer` server. You would only ever need this if creating your own ADB server (perhaps for test mocking).


## Class: AdbDatabase

### Constructor

• **new AdbDatabase**(`api`, `dbId`, `opts?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | `AdbApi` |
| `dbId` | `string` |
| `opts?` | `DbConfig` |

### Properties

#### isReady

• **isReady**: `Promise`<`any`\>

___

#### api

• **api**: `AdbApi`

___

#### dbId

• **dbId**: `string`

### Methods

#### describe

▸ **describe**(): `Promise`<`DbInfo`\>

**`desc`** Get metadata and information about the database.

##### Returns

`Promise`<`DbInfo`\>

___

#### list

▸ **list**(`path`, `opts?`): `Promise`<`Object`\>

**`desc`** List records in a table.

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` \| `string`[] |
| `opts?` | `ListOpts` |

##### Returns

`Promise`<`Object`\>

___

#### get

▸ **get**(`path`): `Promise`<`Record`<`object`\>\>

**`desc`** Get a record in a table.

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` \| `string`[] |

##### Returns

`Promise`<`Record`<`object`\>\>

___

#### put

▸ **put**(`path`, `value`): `Promise`<`Record`<`object`\>\>

**`desc`** Write a record to a table.

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` \| `string`[] |
| `value` | `object` |

##### Returns

`Promise`<`Record`<`object`\>\>

___

#### delete

▸ **delete**(`path`): `Promise`<`void`\>

**`desc`** Delete a record from a table.

##### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` \| `string`[] |

##### Returns

`Promise`<`void`\>

## Class: AdbSchema<T\>

### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` |

### Constructor

• **new AdbSchema**<`T`\>(`db`, `path`, `opts?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `db` | [`AdbDatabase`](#classesadbdatabasemd) |
| `path` | `string` \| `string`[] |
| `opts?` | [`AdbSchemaOpts`](#interfacesadbschemaoptsmd) |

### Properties

#### path

• **path**: `string`[]

___

#### isReady

• **isReady**: `Promise`<`any`\>

___

#### pkey

• `Optional` **pkey**: `string` \| `string`[]

___

#### pkeyFn

• **pkeyFn**: `PkeyFunction`

___

#### jsonSchema

• `Optional` **jsonSchema**: `object`

___

#### validator

• `Optional` **validator**: `Validator`

___

#### db

• **db**: [`AdbDatabase`](#classesadbdatabasemd)

### Methods

#### list

▸ **list**(`opts?`): `Promise`<`Object`\>

**`desc`** List records in the schema.

##### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | `ListOpts` |

##### Returns

`Promise`<`Object`\>

___

#### get

▸ **get**(`key`, `opts?`): `Promise`<`undefined` \| `Record`<`T`\>\>

**`desc`** Get a record in the schema space.

##### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `opts?` | `ValidationOpts` |

##### Returns

`Promise`<`undefined` \| `Record`<`T`\>\>

___

#### create

▸ **create**(`value`, `opts?`): `Promise`<`undefined` \| `Record`<`T`\>\>

**`desc`** Add a record to the schema space.

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |
| `opts?` | `ValidationOpts` |

##### Returns

`Promise`<`undefined` \| `Record`<`T`\>\>

___

#### put

▸ **put**(`key`, `value`, `opts?`): `Promise`<`undefined` \| `Record`<`T`\>\>

**`desc`** Write a record to the schema space.

##### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `T` |
| `opts?` | `ValidationOpts` |

##### Returns

`Promise`<`undefined` \| `Record`<`T`\>\>

___

#### delete

▸ **delete**(`key`): `Promise`<`void`\>

**`desc`** Delete a record from the schema space.

##### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

##### Returns

`Promise`<`void`\>

## Interface: AdbSchemaOpts

### Properties

#### pkey

• `Optional` **pkey**: `string` \| `string`[]

___

#### jsonSchema

• `Optional` **jsonSchema**: `object`

