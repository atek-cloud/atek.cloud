---
sidebar_position: 2
---

# Security Model

Atek is a multi-user environment that runs multiple applications. It may be accessible from the public internet and needs to secure itself accordingly.

## User sessions

Users log into the Atek host, setting a cookie on that domain. As cookies cannot be shared between localhost and localhost subdomains, applications are given access to the session through an automated redirect flow which the Atek flow runs (the "bind session" flow).

## Application identity

Each application is assigned a "service key" which acts as its identifier in the system. The app is informed of its current key by the `ATEK_ASSIGNED_SERVICE_KEY` environment variable.

Applications are installed under an "owning user." This is typically the key of a user, but may also be the special "system" key indicating that it is installed for all users. Applications are considered to act on behalf of their owning user, and are identified by both their owning user's key and their service key.

## Authentication

Requests from applications to the Atek server are authenticated using a bearer token which is passed to the application via the `ATEK_HOST_BEARER_TOKEN` environment variable. Therefore they must include that token in their RPC calls under the Authorization HTTP header, using the bearer scheme (e.g. `Bearer ${process.env.ATEK_HOST_BEARER_TOKEN}`).

If the request is an API call to another application, the caller's service key and owning-user key are placed in the following request headers:

- `Atek-Auth-User` - The key of the calling service's owning user.
- `Atek-Auth-Service` - The key of the calling service.

Requests directly to an application by the authenticated user will have the `Atek-Auth-User` header set to that user. The `Atek-Auth-Service` header will be the service's own key, as determined by the `ATEK_ASSIGNED_SERVICE_KEY` environment variable. Any request without either header set should be rejected.

## Sandboxing

Application sandboxing is on the roadmap for Atek. Currently we're comparing using OS jails versus a lightweight VM such as Firecracker.
