import * as path from "https://deno.land/std/path/mod.ts";
import { JsonRpcClient } from "../client.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url.toString()));
const schema = JSON.parse(await Deno.readTextFile(path.join(__dirname, 'api-schema.json')))
const client = new JsonRpcClient(schema)

console.log(await client._rpc('sayHello', ["World"]))
console.log(await client._rpc('concat', ["foo", "bar"]))
console.log(await client._rpc('toObject', ["foo", "bar"]))
try {
  console.log(await client._rpc('badResponse'))
} catch (e) {
  console.log('badResponse:', e.code, e)
}
try {
  console.log(await client._rpc('toObject', ["foo", 1234]))
} catch (e) {
  console.log('badCall:', e.code, e)
}
try {
  console.log(await client._rpc('throwsError'))
} catch (e) {
  console.log('throwsError:', e.code, e)
}
try {
  console.log(await client._rpc('notAMethod'))
} catch (e) {
  console.log('notAMethod:', e.code, e)
}
try {
  console.log(await client._rpc('notImplemented'))
} catch (e) {
  console.log('notImplemented:', e.code, e)
}