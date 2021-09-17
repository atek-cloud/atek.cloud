---
sidebar_position: 1
---

# Writing a Node app

Writing a NodeJS app for Atek should be easy. You may want to refer to the [Hello World application](https://github.com/atek-cloud/hello-world-node).

An Atek application is expected to host an HTTP server. If it needs to, it can communicate with Atek and other Atek applications by speaking to the Atek server. This communication occurs mainly using JSON-RPC over HTTP post requests.

Your app will be passed the following environment variables:

|key|description|
|-|-|
|`ATEK_ASSIGNED_SOCKET_FILE`|The socket file to which you HTTP server should bind.|
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
atek install {path}
```

Atek will install the app and run it from your folder.

:::info
If you need to see logs about what's happening, watch the Atek process: that's where it all shows up for now.
:::

While you're working, you'll probably need to start, stop, and restart the app. You can do that using atek commands:

```
atek restart {id}
atek start {id}
atek stop {id}
```

Your app will be assigned an ID as well as a port. You can access your app either at `http://{id}.localhost` or `http://localhost:{port}`. If you don't know the ID of your service, call `atek ls` to find it.

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

## Authentication

There's no need to implement login or sessions, as Atek does this for you.

Requests sent to your application will have the following headers set by Atek:

- `Atek-Auth-User` - The key of the calling user.
- `Atek-Auth-Service` - The key of the calling service.

You can use these values for identity and permissions decisions. See [Security Model](../dev/security) for more information.

## What next?

Here's where to go next:

- [**Running tests**](/docs/manual/node/running-tests). How to setup a test environment for your app.
- [**Introduction to Atek RPC**](/docs/manual/rpc/intro). How to call APIs exported by Atek and other apps.
- [**Introduction to ADB**](/docs/manual/adb/intro). How to use Atek's default database, ADB.