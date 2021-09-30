---
sidebar_position: 1
---

# Writing a Node app

NodeJS is Atek's runtime for applications. This guide will introduce you to building Atek apps with node. You may want to refer to the [Hello World application](https://github.com/atek-cloud/hello-world-node).

An Atek application is expected to host an HTTP server. If it needs to, it can communicate with Atek and other Atek applications by speaking to the Atek server. This communication occurs mainly using JSON-RPC over HTTP post requests.

Your app will be passed the following environment variables:

|key|description|
|-|-|
|`ATEK_ASSIGNED_SOCKET_FILE`|The socket file to which you HTTP server should bind.|
|`ATEK_ASSIGNED_SERVICE_KEY`|The "key" under which the application is identified by Atek.|
|`ATEK_HOST_PORT`|The port of the host environment HTTP server, which provides the host APIs.|
|`ATEK_HOST_BEARER_TOKEN`|The "Bearer Auth" token which should be used in requests to the host.|

With this in mind, here's the hello world index.js:

```javascript
import http from 'http'

const SOCKET = process.env.ATEK_ASSIGNED_SOCKET_FILE
const server = http.createServer((req, res) => {
  res.writeHead(200).end('Hello, world!')
})
server.listen(SOCKET, e => {
  console.log(`Hello World HTTP webserver running at ${SOCKET}`);
})
```

## Running your app

Rather than running your app using node, you ask atek to do it. (Check out the [cli reference](/docs/reference/cli) for more information.)

During development, this is very simple. Just run:

```
atek install --user {your_username} {path}
```

Atek will install the app and run it from your folder.

:::info
If you need to see logs about what's happening, watch the Atek process: that's where it all shows up for now.
:::

While you're working, you'll probably need to start, stop, and restart the app. You can do that using atek commands:

```
atek ls # list the active processes and find the ID of yours
atek restart {id}
atek start {id}
atek stop {id}
```

Your app will be assigned an ID. You can access your app either at `http://{id}.localhost`. If you don't know the ID of your service, call `atek ls` to find it. (Note that the "ID" is different than the "service key." The service ID is a user-friendly name that can change, while the service key is an opaque & fixed identifer used internally.)

## Authentication

All requests to your application will be routed through Atek. This includes requests from the user in their browser as well as requests from other applications.

Each request will have the following headers set:

- `Atek-Auth-User` - The key of the calling service's owning user.
- `Atek-Auth-Service` - The key of the calling service.

Users can't access your app without logging into Atek first, so these fields will always be set. This means you don't have to worry about implementing sign-in!

Requests to your application from the browser have the `Atek-Auth-User` header set to the logged-in user. In that case, the `Atek-Auth-Service` header be your application's service key, which you can find in the `ATEK_ASSIGNED_SERVICE_KEY` environment variable.

```js
const server = http.createServer((req, res) => {
  if (req.headers['atek-auth-service'] === process.env.ATEK_ASSIGNED_SERVICE_KEY) {
    // a request by this app to itself, most likely from the frontend by the logged-in user
  }
})
```

Requests from the Atek host will have both the service and user keys set to "system".

```js
const server = http.createServer((req, res) => {
  if (req.headers['atek-auth-service'] === 'system' && req.headers['atek-auth-user'] === 'system') {
    // a request from the Atek host environment
  }
})
```

Requests from other installed applications will have the service key set to that app's key. As every application is "owned" by some user, the user header will be set to the app owner's key. (Note that multi-user apps like Atek DB are "owned" by the system user, so be sure to check both the service and user headers to determine who is calling.)

## Publishing your app

When you're ready to share your app, upload it to GitHub or GitLab. People will be able to install it by the repo's URL.

Versioning your app is handled by semantic version tags. When you need to publish an update, you create a new tag with the new version and push that to your remote.

:::note
You **must** include semantic version tags in the repo for people to install it.
:::

Here's an example of creating and publishing an app:

```
git init
git add .
git commit -m "Initial commit"
git tag 1.0.0
git remote add origin git@github.com:example/my-project.git
git push -u origin master --tags
```

And here's an example of pushing an update:

```
git add .
git commit -m "My update"
git tag 1.0.1
git push --tags
```

When somebody installs or updates your app, Atek will automatically run `npm install` and `npm run build`, so there's no need to include node_modules or the built assets in your repo.

## Manifest file

You can specify Atek-specific information with the `atek.json` manifest file (see the [manifest reference](/docs/reference/manifests)).
Here is a simple example:

```json
{
  "name": "Hello World",
  "description": "Example application. Says 'Hello World'.",
  "author": "Paul Frazee",
  "license": "MIT"
}
```

This information will be used by Atek in various UIs.

## What next?

Here's where to go next:

- [**Running tests**](/docs/manual/node/running-tests). How to setup a test environment for your app.
- [**Introduction to Atek RPC**](/docs/manual/rpc/intro). How to call APIs exported by Atek and other apps.
- [**Introduction to ADB**](/docs/manual/adb/intro). How to use Atek's default database, ADB.