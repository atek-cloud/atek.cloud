---
sidebar_position: 1
---

# The Atek Architecture

:::caution
  **Atek is still in early development.**
  Until Atek reaches v1, users should beware of breaking changes which may not be backwards compatible.
  Atek is available now as a developer preview.
  This document will update as Atek progresses.
:::

Atek is a personal cloud for Web 3.0 applications. The "Web 3.0" is a catchall term for blockchains ([Ethereum](https://ethereum.org/), [Bitcoin](https://bitcoin.org/en/)) peer-to-peer networks ([Hypercore Protocol](https://hypercore-protocol.org), [IPFS](https://ipfs.io), [Secure Scuttlebutt](https://scuttlebutt.nz/)) and many other decentralization technologies. The goal of Web 3.0 is for the Web to be run-and-owned-by users, and that's the goal for Atek as well.

Atek is designed for most people to use. As a personal cloud, Atek must:

- Provide user-friendly tools to install applications and manage user data.
- Require minimal configuration and maintenance.
- Backup user data reliably.
- Run on small- to medium-sized servers.

As a Web 3.0 platform Atek must:

- Run a variety of protocol daemons and wallets.
- Share data and APIs between programs (interoperation).
- Provide secure and convenient key management.

Atek accomplishes these goals with a microservice-like architecture. The host environment orchestrates user programs (services) and routes messages between services using API descriptions. When possible, strict schemas are used to ensure interoperation. By focusing on interoperation, we increase flexibility and enable programs to work together to help users manage their data.

## Motivations

<img src="/img/diagrams/web2-vs-web3.png" />

The Web 3.0's mission to decentralize all software, meaning that users run their own apps and connect via autonomous networks.

Currently there's a hole in the Web 3.0 stack: the runtime platform. While Ethereum is able to run programs on its global blockchain, there's no ideal way for users to run apps on their hardware. This means that intermediary services are cropping up to run applications which connect to blockchains. If this continues, the intermediaries may turn into the same kind of silos that the Web 2.0 has. Atek solves this by acting as a platform for users to install and run Web 3.0 applications, giving them ownership of their wallets, their data, and the programs they run.

Another challenge for Web 3.0 software is that blockchains aren't ideal for all use-cases. Apps frequently need to store private user-data or run transactions (like publishing a blogpost) for no cost and at high throughput. Atek solves this by including [Hypercore Protocol](https://hypercore-protocol.org) and other non-blockchain p2p networks to store and sync user data.

A key concept for Atek is the home server:

<img src="/img/diagrams/home-server.png" />

The home server is a small- to medium-sized device where all data is stored. Atek runs the applications on the home server and user devices connect to the home server via Web clients. Atek's target hardware is a [Raspberry Pi](https://www.raspberrypi.org/), an affordable and easy-to-use computer.

Historically it has been difficult to connect to a home server from outside of a residential LAN. Most solutions rely on a proxy service. Atek instead uses the [Hyperswarm](https://github.com/hyperswarm) network, which creates direct encrypted connections via a [DHT](https://en.wikipedia.org/wiki/Distributed_hash_table) with hole-punching capabilities.

<img src="/img/diagrams/home-server-remote-connectivity.png" />

Another common challenge for home servers is that they lack connectivity to each other. This might be solved using [federation](https://en.wikipedia.org/wiki/Federation_(information_technology)), but federated networks are rarely designed for home networks. Instead, Atek uses Web 3.0 technologies to network the home servers into a shared application space.

<img src="/img/diagrams/home-server-network.png" />

The Web 3.0 applications enable social connectivity while the home servers provide data isolation and user-operated compute. The Atek ecosystem must develop an easy-to-understand Web 3.0 stack so developers can use these new technologies without too much difficulty.

## Overview

The Atek Architecture is comprised of a "host environment" and multiple userland programs which provide services. The host environment in Atek is currently written in NodeJS, as are the user programs.<sup>†</sup> 

The host environment executes user programs (service orchestration), routes messages, hosts a Web UI, and manages configuration. It depends on a core set of user programs, most importantly the [Hypercore Protocol](https://hypercore-protocol.org) daemon and the Atek Database (ADB) service where program and user configuration is stored. The core services and Web UI may be reconfigured, creating the possibility of alternative/custom distributions of Atek.

Programs import and export APIs which are identified by a global ID (e.g. `example.com/my-api`) and various metadata. Messages are sent to the host environment where they are routed to their destinations by matching call metadata (the ID and other attributes) against registered services.

The Atek DataBase (ADB) service uses a conventional approach to global IDs, JSON schemas, and other metadata to describe tables. To ensure ease-of-use, no schemas or models are required, but a toolset for publishing and using schemas via NPM modules is made available.

<sup>†</sup> <em>Both of these choices may evolve over time; for instance, the host environment could be rewritten in other languages for performance, and user programs will need to expand to include docker and/or wasm runtimes. Secure sandboxing is also required.</em>

## Messaging architecture

<img src="/img/diagrams/messaging-layer.png" />

Atek supports two kinds of messaging transports: RPC and Proxy. These APIs are declared via the service's [manifest file](#manifests) where the API ID, transport, and other metadata are defined.

Outgoing requests are sent to the host environment's "API gateway" with a description of the target API, including the API ID. The gateway matches the description against registered services and then dynamically routes the request. If no match is found, an error response is sent.

An authorization token is passed as an environment variable; this token should be included in calls to the host environment using Bearer Authentication. Likewise, the assigned listening port as well as the host environment's port are passed as environment variables, giving the program knowledge of where to listen and where to send calls, respectively.

<small>Discussions: <a href="https://github.com/atek-cloud/atek/discussions/4">#4</a>, <a href="https://github.com/atek-cloud/atek/discussions/7">#7</a></small>

### RPC transport

The "RPC transport" is the primary mechanism for communicating between Atek services. It is a simple request/response flow which carries the API description, method name, and params, followed by a simple result/error response.

Atek uses JSON-RPC via HTTP POST to send messages between services. JSON-RPC was chosen for the following reasons:

- JSON parsing and serialization is optimized in the JS environments which currently implement Atek.
- JSON-RPC is simple to use over many different transports (HTTP, WebSockets, WebRTC, Hyperswarm sockets).
- JSON-RPC is simple to describe in APDL. (Alternatives such as HTTP/REST are much more complicated to describe.)

The downsides of JSON-RPC are:

- Less compact (this can be alleviated using compression).
- Poor at representing binary data (requires base64 encoding).
- No streams primitive.

The use of JSON-RPC should be re-evaluated as the project evolves.

Services provide RPC APIs by hosting HTTP POST endpoints under their assigned port. An exports field in their [manifest file](#manifests) maps the ID and related metadata to the HTTP path of the endpoint.

### Proxy transport

The "Proxy transport" is provided for services with pre-existing wire protocols which are difficult to port to Atek's JSON-RPC transport. This is common for wallets and protocol daemons.

Services provide Proxy APIs by hosting Websocket endpoints under their assigned port. An exports field in their [manifest file](#manifests) maps the ID and related metadata to the HTTP path of the endpoint.

### Internal messaging

Much of the messaging in the Atek Architecture is "internal," meaning between the user programs or between programs and the host. These messages are delivered exclusively through the host environment's API gateway - services should never communicate directly with each other.

### External messaging

<img src="/img/diagrams/external-messaging.png" />

With the correct permissions, a user service may open direct external network connections. The Hypercore service is an example of this. By default, user programs are not allowed to access the network directly and can only communicate by messaging the host environment's API gateway<sup>†</sup>.

<img src="/img/diagrams/external-message-flow.png" />

In the future, peer-to-peer messaging over the "Hyperswarm" network may be coordinated by the Hypercore service. User programs could request peer connections through the Hypercore service's API, which then proxies the messages over the network on their behalf.

HTTP or WebSocket messaging to other devices should be coordinated by the host environment. As with p2p sockets, programs must request these connections and have permissions applied on a case-by-case basis.

Once all external messaging is routed through the host environment and core services, we will be able to audit, permission, and (when appropriate) dynamically re-route messages. Again, this is contingent on the sandbox introduction, but the system should be designed with the presence of the sandbox in mind.

<sup>†</sup> <em>As the Node runtime is not currently sandboxed, these permissions are not enforced yet.</em>

## The host environment

### Service execution

Service execution is managed by the host environment. Programs are currently run as Node scripts. As Node lacks sandboxing tools there is no perimeter enforced at this time. In the near future, Atek needs to support other runtimes (docker, possibly wasm) and introduce a consistent sandboxing solution.

**⚠️ NOTE! Until a sandbox is introduced, Atek is not a safe environment. Node has no sandbox, and the ideal model will use containers or VMs to restrict program access to the host device. The security model described will not apply until this is done.**

Programs are passed a small set of environment variables and allowed access to two ports: the host environment's port and an assigned socketfile which the program must listen on.

In the ideal sandbox, access to the hosting device would be gated; all external access would be accomplished through RPC calls to the host environment. More relaxed sandboxes will be required for wallets and protocol daemons, including more access to network ports and the local filesystem, but these should be the exception: for instance, applications should seek to store data in Atek DB or other similar data stores as these can be managed by Atek.

### Service IDs and keys

All services have an opaque "key" identifier which is generated upon installation. These keys should be used by all software to reference the service (e.g. in permissions or db records), as they are guaranteed not to change.

Services also possess a user-friendly "ID" attribute which is selected by the user or generated from the install package. These IDs are used to make the services easier to manage for the users, but are mutable and therefore must always be mapped to the service key. IDs are also used as subdomains for the services (see [Proxy to subdomains](#proxy-to-subdomains)).

The host environment uses a special "key" of 0 to identify itself, e.g. in permissions or other metadata, as well as the ID of "system".

### Service installation and updating

Atek includes tools to install and auto-update services.

Services may be installed from two locations: the Atek service's local filesystem and a Git repository.

If installed by a Git repository, Atek will clone the repository into the `~/.atek/packages` folder. Additionally, if the service uses the Node runtime, it will execute `npm install` and `npm run build` after installation.

Git repositories may indicate their versions using tags. The tags must be semantic versions. Atek will periodically fetch the git repository and check for tags with a higher version. It will then prompt the user to update to the new tag. (Users may pin their services to a specific version range.)

### Server database and the config file

Atek stores state in two locations:

- A config file (`~/.atek/config.json` by default)
- The "Server Database," an Atek DB database.

The config file includes minimal configuration required to bootstrap the host program. The server database includes all other state, including installed services, user accounts, permissions, etc.

### Host initialization flow

Atek starts itself with the following steps:

1. Load the config file.
2. Start the host HTTP server, which includes the API gateway.
3. Load "core services." These are hardcoded (currently the Hypercore daemon, Atek DB, and Lonestar Web UI) but may be overridden in the config file.
4. Read additional config from the Server Database in Atek DB. If the Server Database does not yet exist, it will be created.
5. Load any user-installed services.

### User accounts

Atek is a multi-user environment as multiple users may share a hosting server (e.g. in home deployments). User identifying keys are automatically generated and opaque. Users may have the "role" attribute set to "admin" get special privileges over the system, including the ability to view all logs, install/configure system-wide programs, and read/write all user data.

Programs have an owning user which dictates who may access the program and who the program represents. The exception to this rule is programs installed under the special "system" user, which is considered a multi-user program. As a consequence, a program may be installed multiple times (for each user) or once (for all users). Programs may be designed for a single user or multiple user installation, as is appropriate for the program. (For instance, the Hypercore service must be a multi-user program, while a personal website might be a single-user program.)

### Permissions

Permissioning is still under active development. The system must provide permissioning for the host environment's users, the individual programs, and for remote users. This requires a flexible registry for declaring, configuring, requesting, and enforcing permissions.

API calls to programs should include metadata which indicate the service and user which originated the call. If additional permissions are required, they can be applied by the program at runtime.

<small>Discussions: <a href="https://github.com/atek-cloud/atek/discussions/3">#3</a></small>

### Proxy to subdomains

The host environment proxies to the services using their IDs as subdomains. This is the recommended way to access installed services (rather than accessing them by their assigned ports). Conveniently, localhost subdomains work automatically on local browsers with no need to configure `/etc/hosts`.

### GUI environment ("main service")

The host environment's "main service" -- that is, the HTTP UI which it hosts -- is a proxy to a service, much like the subdomains. It is set by every user in their user record's settings, and must be an application "owned" by that user.

The default GUI environment in Atek is called [Lonestar](https://github.com/atek-cloud/lonestar).

## Core services

The following user programs are specified as "core services" to be included in the host environment deployment by default. These services may be changed by modifying the config file, but the host environment currently depends on a program exporting the `atek.cloud/adb-api` API to bootstrap itself.

### Hypercore service

The Hypercore service wraps a program developed by the [Hypercore Protocol](https://hypercore-protocol.org) organization called "Hyperspace." It implements the Hypercore protocol networking and data-storage, and provides APIs for:

- Hypercore reads/writes, storage, and networking
- Hyperswarm sockets

The "hypercore" is a low-level log structure. Higher level data structures have been implemented on top of the log, including Hyperbee (a key-value store) and Hyperdrive (a files system). These higher-level structures are not exported by the Hypercore service's API; instead, they are imported as modules into a dependant program (e.g. in the ADB service) and then given the Hypercore service's log-structure API as their "backend." This design helps keep the Hypercore service as minimal as possible, and gives other programs freedom to evolve their data structures over time.

### ADB service

The "ADB" (Atek DataBase) service is a JSON-document database designed to simplify application development.

ADB depends on the Hypercore service to store and replicate databases.

<small>Discussions: <a href="https://github.com/atek-cloud/atek/discussions/6">#6</a></small>

#### ADB schemas

Atek DB does not provide any baked-in schema concept. Instead, it provides a key space with a folder-like concept of subkeys. This means records may be addressed at locations such as:

```
/profile
/users/bob
/atek.cloud/databases/1
```

As suggested by the last entry, the "key path" may be used to indicate the semantics of a record. This is a conventional approach which developers and users may choose to adopt, but which is used regularly in Atek's core software.

The Atek DB API includes tooling for applying JSON-Schema validation at the "client" side (within applications). This tooling is optional and includes multiple options for handling validation failures. To share these schemas, developers can publish them as NPM modules. This makes for a simple, hands-off, and intuitive approach for sharing data models between software.

## User programs

User programs are Node scripts which bind an HTTP server to their assigned socketfile. Over time, Docker may be introduced to allow other runtimes.

### Manifests

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

### Environment variables

The following environment variables are passed to the application process:

- `ATEK_ASSIGNED_SOCKET_FILE`: The socket-file to which the application process' HTTP server should bind.
- `ATEK_ASSIGNED_SERVICE_KEY`: The "key" under which the application is identified by Atek.
- `ATEK_HOST_PORT`: The port of the host environment HTTP server, which provides the host APIs.
- `ATEK_HOST_BEARER_TOKEN`: The "Bearer Auth" token which should be passed in the HTTP Authentication header in requests to the host.

Users may also define environment variables which are passed to the process, but should avoid the `ATEK_` prefix to avoid conflicts.
