# @atek-cloud/adb-tables

Repo: https://github.com/atek-cloud/adb-tables

Atek core ADB schemas

```
npm install @atek-cloud/adb-tables
```

```typescript
import adb from '@atek-cloud/adb-api'
import { accountSessions, accounts, databases, services } from '@atek-cloud/adb-tables'

const mydb = adb.db('mydb')
await accountSessions(mydb).list() // => {records: Record<AccountSession>[]}
await accounts(mydb).list() // => {records: Record<Account>[]}
await databases(mydb).list() // => {records: Record<Database>[]}
await services(mydb).list() // => {records: Record<Service>[]}
```