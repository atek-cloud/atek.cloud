import { parse } from "https://deno.land/std@0.104.0/encoding/yaml.ts"
import { resolve } from "https://deno.land/std@0.104.0/path/mod.ts"

const OUT_DIR = resolve('.', 'public')
const SCHEMAS_OUT_DIR = resolve(OUT_DIR, '.well-known', 'apdl')
const SCHEMAS_REPO = 'https://github.com/atek-cloud/atek-schemas.git'
const SCHEMAS_REPO_DIR = await Deno.makeTempDir()

interface Schema {
  id: string
}
function isSchema (obj: Schema): obj is Schema {
  return typeof obj === 'object' && typeof obj.id === 'string'
}

console.log('💬 Cloning', SCHEMAS_REPO)
const co1res = await Deno.run({
  stdout: 'inherit',
  stderr: 'inherit',
  cmd: ['git', 'clone', SCHEMAS_REPO, SCHEMAS_REPO_DIR]
}).status()
if (!co1res.success) {
  throw 'Failed to clone schemas repo'
}
console.log('✅ Cloned', SCHEMAS_REPO)

console.log('💬 Writing schemas to .well-known/apdl')
const schemaFiles = []
for await (const file of Deno.readDir(SCHEMAS_REPO_DIR)) {
  if (file.name.endsWith('.yaml')) {
    const schema = parse(await Deno.readTextFile(resolve(SCHEMAS_REPO_DIR, file.name))) as Schema
    if (isSchema(schema) && schema.id.startsWith('atek.cloud/')) {
      schemaFiles.push(schema)
    }
  } else if (file.name.endsWith('.json')) {
    const schema = JSON.parse(await Deno.readTextFile(resolve(SCHEMAS_REPO_DIR, file.name))) as Schema
    if (isSchema(schema) && schema.id.startsWith('atek.cloud/')) {
      schemaFiles.push(schema)
    }
  }
}
for (const schemaFile of schemaFiles) {
  const name = schemaFile.id.split('/')[1]
  await Deno.writeTextFile(resolve(SCHEMAS_OUT_DIR, `${name}.json`), JSON.stringify(schemaFile, null, 2))
}
console.log('✅ Schemas written')
