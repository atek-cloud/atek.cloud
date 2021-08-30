---
sidebar_position: 2
---

# V1 Roadmap

We're on the road to V1. Here's what has been done and what's still todo.

*These items are only what the core team has committed to. We are [open to new proposals](https://github.com/atek-cloud/atek/discussions) as Atek is a community project.*

- **Runtimes**
  - ✅ &nbsp;NodeJS runtime
  - ⬜️ &nbsp;Docker runtime
- **Security**
  - ⬜️ &nbsp;Service permissions model
  - ⬜️ &nbsp;User permissions model
  - ⬜️ &nbsp;Service sandbox
- **Services**
  - ✅ &nbsp;Installation APIs
  - ✅ &nbsp;Auto-update APIs
  - ✅ &nbsp;Configuration 
- **Messaging layer**
  - Routing
    - ✅ &nbsp;Routing by transport and API ID
    - ⬜️ &nbsp;Routing by custom API metadata
  - RPC
    - ✅ &nbsp;Request/response via JSON-RPC
    - ⬜️ &nbsp;Streams
    - ⬜️ &nbsp;Events
  - ✅ &nbsp;Proxy transport
  - ⬜️ &nbsp;Hyperswarm sockets
- **Atek DB**
  - ✅ &nbsp;Table definitions and enforcement
  - ✅ &nbsp;Basic CRUD operations
  - ⬜️ &nbsp;Complex queries (filter or sort by multiple conditions)
  - ⬜️ &nbsp;Indexing on attributes
  - ⬜️ &nbsp;Computed views
  - ⬜️ &nbsp;Multi-writer databases
- **Lonestar Web UI**
  - ⬜️ &nbsp;Application launcher
  - ⬜️ &nbsp;User management
  - ⬜️ &nbsp;Data management
  - ⬜️ &nbsp;Service management
- **Protocols**
  - ✅ &nbsp;Hypercore Protocol
  - ⬜️ &nbsp;Ethereum