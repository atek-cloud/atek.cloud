---
sidebar_position: 3
---

# atek.json manifests

Applications must include an `atek.json` manifest file at the root of their source package. Here is a quick overview of their properties:

- **title** The title of the application.
- **description** A short description of what the application is/does.
- **author** The author of the application.
- **license** A short string describing how the application is licensed (e.g. "MIT").
- **frame** A boolean identifying whether the application should run inside an iframe in the main application, or as its own application in a subdomain.
- **exports** An array of exported API descriptions. Each entry is an object with the following properties:
  - **api** The ID of the API. This should be URL-like, e.g. `example.com/my-api`, and use a domain name owned by the creator of the API.
  - **path** The path of the HTTP endpoint where this API is exposed.
  - **transport** An optional identifier of "rpc" or "proxy." Defaults to "rpc."
  - In the future, a means for custom metadata will be added to these objects to assist with API-routing.

This manifest is likely to expand and change as Atek develops.

Here is an example manifest pulled from ADB:

```javascript
{
  "title": "Atek Database",
  "description": "A Hypercore-based DB.",
  "author": "Paul Frazee <pfrazee@gmail.com>",
  "license": "MIT",
  "frame": true,
  "exports": [
    {"api": "atek.cloud/adb-api", "path": "/_api/adb"},
  ]
}
```