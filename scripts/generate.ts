import { parse } from "https://deno.land/std@0.104.0/encoding/yaml.ts"
import { resolve } from "https://deno.land/std@0.104.0/path/mod.ts"

const OUT_DIR = resolve('.', 'public')
const SCHEMAS_OUT_DIR = resolve(OUT_DIR, '.well-known', 'apdl')
const CODE_OUT_DIR = resolve(OUT_DIR, 'x')

interface Schema {
  id: string
}
function isSchema (obj: Schema): obj is Schema {
  return typeof obj === 'object' && typeof obj.id === 'string'
}

// main
// =

await writeSchemas('https://github.com/atek-cloud/atek-schemas.git')
await writeCode('rpc', 'https://github.com/atek-cloud/deno-rpc.git')

// tasks
// =

async function writeSchemas (SCHEMAS_REPO: string) {
  const SCHEMAS_REPO_DIR = await Deno.makeTempDir()

  console.log('💬 Cloning', SCHEMAS_REPO)
  await run(['git', 'clone', SCHEMAS_REPO, SCHEMAS_REPO_DIR])
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
}

async function writeCode (CODE_REPO_NAME: string, CODE_REPO: string) {
  const CODE_REPO_DIR = await Deno.makeTempDir()

  console.log('💬 Cloning', CODE_REPO)
  await run(['git', 'clone', CODE_REPO, CODE_REPO_DIR])
  console.log('✅ Cloned', CODE_REPO)

  console.log('💬 Enumerating repo version tags')
  const versions = await enumerateGitRepoTags(CODE_REPO_DIR)
  console.log('✅ Enumerated', (versions.length + 1), 'versions')

  console.log('💬 Copying code...')
  await writeCodeRepo(CODE_REPO_NAME, CODE_REPO_DIR, 'latest')
  for (const version of versions) {
    await writeCodeRepo(CODE_REPO_NAME, CODE_REPO_DIR, version)
  }
  console.log('✅ Code copied for', CODE_REPO_NAME)
}

async function enumerateGitRepoTags (path: string) {
  const p = Deno.run({
    cwd: path,
    stdout: 'piped',
    stderr: 'piped',
    cmd: ['git', 'tag', '-l']
  })
  const res = await p.status()
  if (!res.success) {
    throw `Failed git tag -l`
  }
  const outstr = new TextDecoder().decode(await p.output())
  return outstr.split('\n').filter(Boolean)
}

async function writeCodeRepo (CODE_REPO_NAME: string, CODE_REPO_DIR: string, version: string) {
  const tag = version === 'latest' ? 'master' : version
  const CODE_REPO_OUT_DIR = resolve(CODE_OUT_DIR, `${CODE_REPO_NAME}@${version}`)
  await run(['git', 'checkout', tag], CODE_REPO_DIR)
  await run(['rm', '-Rf', CODE_REPO_OUT_DIR])
  await run(['cp', '-r', CODE_REPO_DIR, CODE_REPO_OUT_DIR])
  await run(['rm', '-Rf', resolve(CODE_REPO_OUT_DIR, '.git')])
}

async function run (cmd: string[], cwd?: string) {
  const res = await Deno.run({
    cwd,
    stdout: 'inherit',
    stderr: 'inherit',
    cmd
  }).status()
  if (!res.success) {
    throw `Failed ${cmd.join(' ')}`
  }
}