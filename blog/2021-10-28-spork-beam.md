---
slug: spork-beam
title: "Spork Beam: Encrypted, Networked Pipes"
description: "Send files and streams between devices with your CLI"
author: Paul Frazee
author_title: Atek Core Team
author_url: https://twitter.com/pfrazee
author_image_url: https://avatars.githubusercontent.com/u/1270099?v=4
image: "/img/blog/spork-beam.png"
tags: [announcements]
---

With Spork v1.3.1 we've added the `beam` command: an encrypted, networked pipe using [Mafintosh's hyperbeam module](https://github.com/mafintosh/hyperbeam).

```bash
$ npm install -g @atek-cloud/spork
```

Beam is very simple to use. On the first device, you'd run something like:

```bash
$ echo "SPORK POWERS!" | spork beam
```

This will output instructions for completing the pipe:

```bash
▶ Run the following command to connect:
▶
▶   spork beam upxtbzbcqvzlleo3vn4r3swfepk4nr7qerfksotlmssuttllxwhq
▶
▶ To restart this side of the pipe with the same key add -r to the above
▶ Joined the DHT - remote address is XXX
```

On the second device, you'll enter:

```bash
$ spork beam upxtbzbcqvzlleo3vn4r3swfepk4nr7qerfksotlmssuttllxwhq
```

And soon you'll see:

```bash
▶ Connecting pipe...
▶ Joined the DHT - remote address is XXX
▶ Success! Encrypted tunnel established to remote peer
SPORK POWERS!
```

Tada! Spork powers, activated.

## Sending files

Beam is quite good for sending files around:

```bash
# device 1
$ cat secrets.txt | spork beam

# device 2
$ spork beam $THE_KEY > secrets.txt
```

All the instructions are written to stderr, so there's no worry that they'll pollute your file.

## Bidirectional streams

The pipe is bidirectional, so you can send data from either device or both at the same time.

```bash
# device 1
$ echo "Hi there" | spork beam

# device 2
$ echo "And hello to you sir" | spork beam $THE_KEY
```

In fact, you can get a mini chat program going by running `cat` with no parameters so it reads from stdin:

```bash
# device 1
$ cat | spork beam

# device 2
$ cat | spork beam $THE_KEY

# chat away!
```

## Credit to the Hypercore protocol

Spork's magicks come from the incredible [Hypercore Protocol team](https://hypercore-protocol.org). Spork is really a small wrapper around [Hyperswarm](https://github.com/hyperswarm), their networking layer.

[Hop on the Hypercore Protocol Discord](https://chat.hypercore-protocol.org/) if you want to dig more into the work they're doing.

## Links

- [Spork Website](https://spork.sh)
- [Spork Repository](https://github.com/atek-cloud/spork)
- [Hyperswarm](https://github.com/hyperswarm)
- [Atek Discord Server](https://discord.gg/UUCVrFYksv)

&mdash; [Paul](https://twitter.com/pfrazee)
