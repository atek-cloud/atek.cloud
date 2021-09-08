---
slug: hello-world
title: Hello, world
author: Paul Frazee
author_title: Atek Core Team
author_url: https://twitter.com/pfrazee
author_image_url: https://avatars.githubusercontent.com/u/1270099?v=4
image: "/img/blog/hello-world-card.png"
tags: [announcements]
---

![Hello, world](/img/blog/hello-world-lg.png)

Today I'm really happy to announce the Atek project, an open source peer-to-peer Home Cloud.

![Home PI](/img/diagrams/home-server.png)

**Atek is a personal cloud for small home servers like [Raspberry Pis](https://www.raspberrypi.org). It uses peer-to-peer tech to connect your devices so you can share posts, photos, chats, and applications with the privacy and control you want.**

Atek uses [Hypercore Protocol](https://hypercore-protocol.org) as its main networking and data layer, but is designed to flexibly add services so that other technologies ([IPFS](https://ipfs.io), [SSB](https://scuttlebutt.nz), [Ethereum](https://ethereum.org/), etc) can be added.

## Developer preview

Atek is available as a developer preview. I'm following the "release early and often" philosophy so that other developers can get involved. Links:

- [Getting Started](/docs/manual/getting-started)
- [Architecture Document](/docs/manual/dev/architecture)
- [GitHub org](https://github.com/atek-cloud)
- [Discussions board](https://github.com/atek-cloud/atek/discussions)
- [Discord server](https://discord.com/channels/883086455092674602/883086456464224356)
- [Twitter account (@atek_cloud)](https://twitter.com/atek_cloud)

The [Architecture Document](/docs/manual/dev/architecture) is a very good overview of how Atek works.

## General ideas

### Phoning home with Hyper

Most home servers are traditional Web servers, which means a connection from outside the network requires VPNs, proxies, Dynamic DNS, and so on. This is more work than most people can do or care to do.

To replace the commercial cloud with home servers, we need to be able to phone home from anywhere using our phones and laptops. We can accomplish this using [Hypercore Protocol](https://hypercore-protocol.org)'s networking stack, [Hyperswarm](https://github.com/hyperswarm/). Custom desktop and mobile apps will render your server's Web apps using this stack, essentially proxying HTTP calls over Hyperswarm to reach your home device from anywhere.

![Phoning home](/img/diagrams/home-server-remote-connectivity.png)

### Networking home servers together

Web services don't often federate, and when they do they struggle to federate with servers on home networks. This is a problem because Atek's goal is to run social/collaborative applications which connect between multiple home clouds.

New tech such as [Hypercore Protocol](https://hypercore-protocol.org), [IPFS](https://ipfs.io), and [SSB](https://scuttlebutt.nz) make decentralized p2p databases possible. Atek uses Hypercore to create the [Atek Database](/docs/manual/adb/intro), a decentralized document-store with strict schemas. Using these kinds of protocols (arguably everything under the "Web 3.0" umbrella) we can share and sync data between home servers, creating social connectivity between them.

![Internet of homes](/img/diagrams/home-server-network.png)

### Small core, open ecosystem

Atek uses a small core server that runs programs (services) and routes API-calls between them. All other functionality, including the protocols, primary data store, default frontend, and actual apps are user programs. A set of "core services" are set in the config file to boostrap the server, and then the rest are loaded from records in the data store.

This "everything in userland" approach is designed to maximize flexibility for users to choose protocols and applications. Atek will ship with an opinionated core, but because that core is established by the config file, it's trivial to create alternative distros. It's also possible to install all kinds of new services in the default Atek, so if you prefer IPFS or SSB to Hypercore, write an Atek app for those protocol daemons and have at it! ([You can see what Hypercore's daemon app looks like here.](https://github.com/atek-cloud/hyper-daemon))

## Various

### Learning from Sandstorm

[Sandstorm](https://sandstorm.io) is a personal cloud started by Kenton Varda. It does a lot of what Atek wants to do: simple app installation, easy maintenance, good privacy.

Atek differs in a few ways. The first is that Atek should run on home hardware. Hypercore is designed to punch through hostile NATs and locate peers. This gives us a solid foundation to phone home from anywhere without involving a proxy. It also means we can build applications which are still socially connective without using central services.

Atek also tries to minimize novel ideas so that developers can easily get started. Sandstorm uses a "grains" model for sandboxing data which offers a lot of benefits, but diverges from how most applications are built. Advancing a new idea like that requires a lot of resources which Atek won't have, so when we do introduce novelty &mdash; i.e. the whole p2p/web3 stack &mdash; we're going to try to stick with tools that have their own momentum, and focus on familiarity when introducing something new.

### Learning from Beaker browser

[Beaker browser](https://beakerbrowser.com) was a p2p Web browser which I started. It was a cool idea: it used [Hypercore](https://hypercore-protocol.org) as a drop-in replacement for HTTP. Brave and Opera are experimenting with this now with [IPFS](https://ipfs.io). Peer-to-peer sites are an engaging premise for where the Web could go.

The challenge was that Beaker apps had no backend. If you want to build 100% client-side SPAs, you need something akin to a Firebase: a toolkit of databases, users/identity, and networking. We took a lot of shots at building that, but struggled to create APIs which matched the browser's security and page-based runtime model. Having to create a single monolithic stack for everybody to use is difficult, especially for novel tech. This is why Atek prioritizes a flexible ecosystem.

The next challenge was resource constraints. Beaker was originally meant to accept any-and-all web3 tech as a plugin, but many of these protocols require a sizable CPU, RAM, and disk budget, and the client-side applications added more overhead onto that. Consequently, I've come to believe it's better to use dedicated devices (home/personal clouds) for web3 apps and have the user devices connect to those devices in a client/server model. This is the basic model I've adopted for Atek.

### What is the app runtime?

Atek currently runs NodeJS applications. I had originally planned to use Deno, but ran into some frustrations and deferred including it.

I believe the next step will be to add Docker as a runtime. Again, simple and familiar tools are a benefit, and given Atek's goal to run a variety of protocols, it seems necessary to use containers. That said, I'm locked in debate with a friend who sees Docker as unnecessary overhead (yo dawg, I heard you like entire OS distros) so I'm open to better ideas.

Another near-term concern is answering security sandboxing. I'm still doing my research on the best solution for this, but am leaning toward Firecracker.

### Where does the name come from?

Atek stands for "Austin Texas," where I live. Yeehaw yall.

## Getting involved

Atek is MIT-licensed FOSS and very open to community contributions. Links:

- [Getting Started](/docs/manual/getting-started)
- [Architectural Document](/docs/manual/dev/architecture)
- [GitHub org](https://github.com/atek-cloud)
- [Discussions board](https://github.com/atek-cloud/atek/discussions)
- [Discord server](https://discord.com/channels/883086455092674602/883086456464224356)
- [Twitter account (@atek_cloud)](https://twitter.com/atek_cloud)

As I said before, the [Architecture Document](/docs/manual/dev/architecture) is a very good overview of how Atek works. You can also [reach me on Twitter](https://twitter.com/pfrazee).

&mdash; [Paul](https://twitter.com/pfrazee)