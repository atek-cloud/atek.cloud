import { serve } from "https://deno.land/std@0.99.0/http/server.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import { JsonRpcServer } from "../server.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url.toString()));
const schema = JSON.parse(await Deno.readTextFile(path.join(__dirname, 'api-schema.json')))
const server = serve("0.0.0.0:8000");
const jsonRpcServer = new JsonRpcServer(schema, {
  sayHello: (w: string) => `Hello ${w}`,
  concat: (a: string, b: string) => `${a}${b}`,
  toObject: (a: string, b: string) => ({a, b}),
  badResponse: () => 123,
  throwsError: () => {
    throw new Error('Threw')
  }
})

console.log("listening on 0.0.0.0:8000");

for await (const req of server) {
  await jsonRpcServer.respond(req)
}