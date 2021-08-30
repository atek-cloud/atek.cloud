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

Currently there's a hole in the Web 3.0 stack: the runtime platform. While Ethereum is able to run programs on its global blockchain, there's no ideal way for users to run apps on their hardware. This means that intermediary services are cropping up to run applications which connect to blockchains. If this continues, we may end up with the same kind of silos that the Web 2.0 had.

We need a simple way for users to install and run Web 3.0 applications, giving them ownership of their wallets, their data, and the programs they run. Atek is designed to solve that need.

Another challenge for Web 3.0 software is that blockchains aren't ideal for all use-cases. Apps frequently need to store private user-data or run transactions (like publishing a blogpost) for no cost and at high throughput. Atek solves this by including [Hypercore Protocol](https://hypercore-protocol.org) and other non-blockchain p2p networks to store and sync user data.

<img src="/img/diagrams/home-server.png" />

Because many Web 3.0 technologies are peer-to-peer, Atek can run on home devices. The p2p protocols enable these home servers to connect through hostile NATs and firewalls, enabling applications with the connectivity of traditional cloud applications but with the privacy of a user-owned device. Running at home is not a requirement, however, and Atek should run on any Linux environment, whether a VM/VPS or the host OS.

### Relation to existing software

It's important to understand how Atek relates to existing software.

- Atek is not a replacement for [Kubernetes](https://kubernetes.io/). Kubernetes is a service-orchestration toolset. Atek has its own service orchestrator which could conceivably be replaced by Kubernetes at some point.
- Atek is not a replacement for [Docker](https://www.docker.com/). Docker is a container bundling and execution toolset. Atek currently uses Node and Deno as its runtimes, and should introduce Docker a future runtime.
- Atek is not a replacement for [Ethereum](https://ethereum.org/). Ethereum is a global crypto-currency and smart-contract runtime. Atek runs applications with non-global and/or private state (email, forums, social media). Atek is designed to interface with blockchains like Ethereum; an Ethereum wallet program may be installed and then accessed by other Atek programs.
- Atek is not a replacement for [Nextcloud](https://nextcloud.com/). Nextcloud is a Personal Information Manager that includes files, mail, events, and so on. Atek is a platform for executing applications like Nextcloud, and while some of Atek's builtin functionality may overlap with Nextcloud, Atek is less opinionated about the software it runs and is geared primarily toward Web 3.0 applications.

Atek is most comparible to [Sandstorm.io](https://sandstorm.io/), [Cloudron](https://www.cloudron.io/), [FreedomBox](https://freedombox.org/), and [YunoHost](https://yunohost.org/). These projects describe them using similar language ("self-hosted clouds") and provide similar features. Atek differs from these by its focus on Web 3.0 tech.

## Overview

<img src="/img/diagrams/arch-layout.png" />

The Atek Architecture is comprised of a "host environment" and multiple userland programs which provide services. The host environment in Atek is currently written in NodeJS, while the user programs are currently Deno or Node scripts.<sup>†</sup> 

The host environment executes user programs (service orchestration), routes messages, hosts a Web UI, and manages configuration. It depends on a core set of user programs, most importantly the [Hypercore Protocol](https://hypercore-protocol.org) daemon and the Atek Database (ADB) service where program and user configuration is stored. The core services and Web UI may be reconfigured, creating the possibility of alternative/custom distributions of Atek.

Programs import and export APIs which are identified by a global ID (e.g. `example.com/my-api`) and various metadata. Messages are sent to the host environment where they are routed to their destinations by matching call metadata (the ID and other attributes) against registered services.

The Atek DataBase (ADB) service uses global IDs, JSON schemas, and other metadata to describe tables. The table definitions help ensure correctness and interoperability between programs by enforcing strict conformance to the schemas on read and write.

<sup>†</sup> <em>Both of these choices may evolve over time; for instance, the host environment could be rewritten in other languages for performance, and user programs will need to expand to include docker and/or wasm runtimes. Security primitives such as gvisor or firecracker are needed to sandbox the user programs.</em>

## Messaging architecture

<img src="/img/diagrams/messaging-layer.png" />

Atek supports two kinds of messaging transports: RPC and Proxy. These APIs are declared via the service's [manifest file](#manifests) where the API ID, transport, and other metadata are defined.

Outgoing requests are sent to the host environment's "API gateway" with a description of the target API, including the API ID. The gateway matches the description against registered services and then dynamically routes the request. If no match is found, an error response is sent.

An authorization token is passed as an environment variable; this token should be included in calls to the host environment using Bearer Authentication. Likewise, the assigned listening port as well as the host environment's port are passed as environment variables, giving the program knowledge of where to listen and where to send calls, respectively.

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

The "Proxy transport" is provided for services with pre-existing wire protocols which are difficult to port to Atek's RPC transport. This is common for wallets and protocol daemons.

Services provide Proxy APIs by hosting Websocket endpoints under their assigned port. An exports field in their [manifest file](#manifests) maps the ID and related metadata to the HTTP path of the endpoint.

### Internal messaging

Much of the messaging in the Atek Architecture is "internal," meaning between the user programs or between programs and the host. A multi-device host environment may send internal messages over the network, and therefore may not be strictly "local" to a machine. These messages are delivered exclusively through the host environment's API gateway - services should never communicate directly with each other.

### External messaging

<img src="/img/diagrams/external-messaging.png" />

With the correct permissions, a user service may open direct external network connections. The Hypercore service is an example of this. By default, user programs are not allowed to access the network directly and can only communicate by messaging the host environment's API gateway<sup>†</sup>.

<img src="/img/diagrams/external-message-flow.png" />

In the future, peer-to-peer messaging over the "Hyperswarm" network may be coordinated by the Hypercore service. User programs could request peer connections through the Hypercore service's API, which then proxies the messages over the network on their behalf.


HTTP or WebSocket messaging to other devices should be coordinated by the host environment. As with p2p sockets, programs must request these connections and have permissions applied on a case-by-case basis.

Once all external messaging is routed through the host environment and core services, we will be able to audit, permission, and (when appropriate) dynamically re-route messages. Again, this is contingent on the sandbox introduction, but the system should be designed with the presence of the sandbox in mind.

<sup>†</sup> <em>As the Node runtime is not currently sandboxed, these permissions are only enforced on Deno services for now.</em>

## The host environment

### Service execution

Service execution is managed by the host environment. Programs are currently run as Node or Deno scripts. Deno scripts are sandboxed using Deno's JS isolate configuration, but as Node lacks sandboxing tools there is no perimeter enforced at this time. In the near future, Atek needs to support other runtimes (docker, possibly wasm) and introduce a consistent sandboxing solution (gvisor, firecracker).

**⚠️ NOTE! Until a sandbox is introduced, Atek is not a safe environment. Deno's sandbox provides some security but Node has no sandbox, and the ideal model will use virtualization and/or OS tools to restrict program access to the host device. The security model described will not be active until this is done.**

Programs are passed a small set of environment variables and allowed access to two ports: the host environment's port and an assigned port which the program must listen on.

In the most restrictive sandboxing mode, no other access to the hosting device is permitted; all external access is accomplished through RPC calls to the host environment. More relaxed sandboxes will be required for wallets and protocol daemons, including more access to network ports and the local filesystem, but these should be the exception: for instance, applications should seek to store data in ADB or other similar data stores as these can be managed by Atek.

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

1. A config file (`~/.atek/config.json` by default)
2. The "Server Database," an ADB database.

The config file includes minimal configuration required to bootstrap the host program. The server database includes all other state, including installed services, user accounts, permissions, etc.

### Host initialization flow

Atek starts itself with the following steps:

- Loading a config file.
- Start the host HTTP server, which includes the API gateway.
- Load "core services." These are hardcoded (currently the Hypercore daemon and ADB) but may be overridden in the config file.
- Read additional config from the Server Database, an ADB database. If this does not yet exist, it will be created.
- Load any user-installed services.

### User accounts

This system is still under active development. Atek must be a multi-user environment, as multiple users may share a hosting server (e.g. in home deployments). User IDs are automatically generated and opaque. Users may have the "super user" flag set to get special privileges over the system, including the ability to view all logs, install/configure system-wide programs, and read/write all user data.

Programs will likely need to be installed for individual users or for the entire system. As a consequence, a program may be installed multiple times (for each user) or once (for all users). Programs may be designed for a single user or multiple user installation, as is appropriate for the program. (For instance, the Hypercore service must be a multi-user program, while a personal website might be a single-user program.)

### Permissions

Permissioning is still under active development. The system must provide permissioning for the host environment's users, the individual programs, and for remote users. This requires a flexible registry for declaring, configuring, requesting, and enforcing permissions.

API calls to programs should include metadata which indicate the service and user which originated the call. If additional permissions are required, they can be applied by the program at runtime.

### Proxy to subdomains

The host environment proxies to the services using their IDs as subdomains. This is the recommended way to access installed services (rather than accessing them by their assigned ports). Conveniently, localhost subdomains work automatically on local browsers with no need to configure `/etc/hosts`.

### GUI environment ("main service")

The host environment's "main service" -- that is, the HTTP UI which it hosts -- is a proxy to a service, much like the subdomains. It can be changed by setting the `mainService` config value to the ID of the service.

The default GUI environment in Atek is called [Lonestar](https://github.com/atek-cloud/lonestar).

## Core services

The following user programs are specified as "core services" to be included in the host environment deployment by default. These services may be changed by modifying the config file, but the host environment currently depends on a program exporting the `atek.cloud/adb-api` API to bootstrap itself.

### Hypercore service

The Hypercore service wraps a program developed by the [Hypercore Protocol](https://hypercore-protocol.org) organization called "Hyperspace." It implements the Hypercore protocol networking and data-storage, and provides APIs for:

- Hypercore reads/writes, storage, and networking
- Hyperswarm sockets

The "hypercore" is a low-level log structure. Higher level data structures have been implemented on top of the log, including Hyperbee (a key-value store) and Hyperdrive (a files system). These higher-level structures are not exported by the Hypercore service's API; instead, they are imported as modules into a dependant program (e.g. in the ADB service) and then given the Hypercore service's log-structure API as their "backend." This design helps keep the Hypercore service as minimal as possible, and gives other programs freedom to evolve their data structures over time.

### ADB service

The "ADB" (Atek DataBase) service is a high-level document database designed to simplify application development. It uses URL-based IDs and JSON-Schemas to describe tables in a globally-interoperable manner.

ADB depends on the Hypercore service to store and replicate databases.

### ADB table-definition revisions and versioning

ADB tables must never break backwards compatibility. This is because Atek applications are not centrally coordinated, and therefore cannot deploy global breaking changes.

If a breaking change is required, a new ADB table ID must be used. For example, if `example.com/my-api` requires a breaking change, then it should be named e.g. `example.com/my-api-v2`.

Non-breaking changes are permitted. Every ADB table includes a `revision` integer which can be used to indicate such a change.

While the "no breaking changes" requirement may seem onerous, there are some simple solutions available. ADB schemas are defined using JSON-Schema, which supports a `"oneOf"` construct to encode multiple different valid structures. This enables a schema to encode both the "old" and the "new" schemas as valid options.

## User programs

User programs are Node or Deno scripts which bind an HTTP server to their assigned port. Over time, Docker may be introduced to allow other runtimes.

### Manifests

Applications must include an `atek.json` manifest file at the root of their source package. Here is a quick overview of their properties:

- **title** The title of the application.
- **description** A short description of what the application is/does.
- **author** The author of the application.
- **license** A short string describing how the application is licensed (e.g. "MIT").
- **exports** An array of exported API descriptions. Each entry is an object with the following properties:
  - **api** The ID of the API. This should be URL-like, e.g. `example.com/my-api`, and use a domain name owned by the creator of the API.
  - **path** The path of the HTTP endpoint where this API is exposed.
  - **transport** An optional identifier of "rpc" or "proxy." Defaults to "rpc."
  - In the future, a means for custom metadata will be added to these objects to assist with API-routing.

This manifest is likely to expand and change as Atek develops.

### Environment variables

The following environment variables are passed to the application process:

- `ATEK_ASSIGNED_PORT`: The port to which the application process' HTTP server should bind.
- `ATEK_HOST_PORT`: The port of the host environment HTTP server, which provides the host APIs.
- `ATEK_HOST_BEARER_TOKEN`: The "Bearer Auth" token which should be passed in the HTTP Authentication header in requests to the host.

Users may also define environment variables which are passed to the process, but should avoid the `ATEK_` prefix to avoid conflicts.
