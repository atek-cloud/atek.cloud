# Atek Database API

`atek.cloud/adb-api`

```
npm install @atek-cloud/adb-api
```

## Defining tables

```javascript
import { defineTable } from '@atek-cloud/adb-api`

export default defineTable({
  id: 'example.com/cats',
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

In typescript, you can include an interface so that you client has correct types:

```typescript
import { defineTable } from '@atek-cloud/adb-api`

interface CatRecord {
  id: string
  name: string
  createdAt: string
}

export default defineTable<CatRecord>({
  id: 'example.com/cats',
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

## Using tables

```typescript
import adb from '@atek-cloud/adb-api'
import cats from '@example-com/cats'

// get or create a database under the 'mydb' alias
const db = adb.db('mydb')

// use the cats table
await cats(db).create({id: 'kit', name: 'Kit'})
await cats(db).list() // => [{key: 'kit', value: {id: 'kit', name: 'Kit', createdAt: '2021-09-07T01:06:07.487Z'}}]
await cats(db).get('kit') // => {key: 'kit', value: {id: 'kit', name: 'Kit', createdAt: '2021-09-07T01:06:07.487Z'}}
await cats(db).put('kit', {id: 'kit', name: 'Kitty'})
await cats(db).delete('kit')
```


