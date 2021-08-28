const tmp = require('tmp')
const sh = require('shelljs')
const fs = require('fs')
const path = require('path')

const PAGES_DIR = path.join(__dirname, '..', 'src', 'pages')
const RPCAPI_DOCS_DIR = path.join(__dirname, '..', 'docs', 'reference', 'rpc-apis')
const ADBTABLES_DOCS_DIR = path.join(__dirname, '..', 'docs', 'reference', 'adb-tables')

const dir = tmp.dirSync({unsafeCleanup: true})

if (sh.exec(`git clone https://github.com/atek-cloud/atek-schemas ${dir.name}`).code !== 0) {
  process.exit(1)
}

const names = fs.readdirSync(dir.name)
let i = 1
for (const name of names) {
  if (!name.endsWith('.d.ts')) {
    continue
  }
  const dts = fs.readFileSync(path.join(dir.name, name), 'utf8')
  const metadata = extractMetadata(dts)

  // write documentation file
  const folder = metadata.type === 'api' ? RPCAPI_DOCS_DIR : ADBTABLES_DOCS_DIR
  const docbasename = name.slice(0, '.d.ts'.length * -1)
  const docpath = path.join(folder, `${docbasename}.md`)
  fs.writeFileSync(docpath, `---
sidebar_position: ${i++}
---

# ${metadata.title || metadata.id || name}

\`${metadata.id}\`

${metadata.description}

\`\`\`typescript
${dts}
\`\`\`
`)
  
  // write redirect page
  const pagename = `${metadata.id.split('/')[1]}.js`
  fs.writeFileSync(path.join(PAGES_DIR, pagename), `import React from 'react';
import {Redirect} from '@docusaurus/router';
export default function RedirectPage () { return <Redirect to="/docs/reference/${metadata.type === 'api' ? 'rpc-apis' : 'adb-tables'}/${docbasename}" />;};`)
}

dir.removeCallback()

function extractMetadata (dts) {
  function extractKV (name) {
    const re = new RegExp(`^${name}\:(.*)$`, 'm')
    return (re.exec(dts)?.[1] || '').trim()
  }
  return {
    id: extractKV('id'),
    type: extractKV('type'),
    title: extractKV('title'),
    description: extractKV('description'),
  }
}
