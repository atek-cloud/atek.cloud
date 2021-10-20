---
slug: weekly-update-sep17-2021
title: "Atek Weekly Update: Sep 17, 2021"
description: Users and auth, auto-updates, and lots of internal tech changes.
author: Paul Frazee
author_title: Atek Core Team
author_url: https://twitter.com/pfrazee
author_image_url: https://avatars.githubusercontent.com/u/1270099?v=4
image: "/img/blog/weekly-update-card.png"
tags: [weekly-update]
---

export const Video = () => (
  <p><video src="/video/blog/sep17-update.mp4" autoplay="autoplay" loop muted style={{maxWidth: '100%', borderRadius: '0.25rem'}}></video></p>
)

It's been one week since [Atek was announced](/blog/hello-world) and it's been a fun first week. We're up to 50 folks in [the discord](https://discord.gg/UUCVrFYksv) and our first two contributors are onboarding now. Exciting times!

So what all happened this week?

:::tip Self-host your life!
Atek is a convenient platform for running NodeJS applications at home or in the cloud using peer-to-peer technology. [Learn more](/).
:::

## Overview

Atek is now at version `0.0.16`. Here's what's new:

- **Atek now auto-updates.** Now it's easier to stay on latest!
- **Users and authentication have been implemented.** Multiple users can share an Atek instance, and each of them runs their own apps and stores their own data.

<Video />

## Technical updates

A lot this week's work occurred behind the scenes:

- **Socket files**. Applications now use unix (file) sockets to communicate with Atek. This reduces the amount of port usage and makes it harder for untrusted applications to connect to your Atek apps. The environment variable passed to applications has accordingly changed from `ATEK_ASSIGNED_PORT` to `ATEK_ASSIGNED_SOCKET_FILE`.
- **Pinned core**. Atek now pins its default core services to a specific version. They will update when Atek pushes a new release.
- **Auth headers**. Authentication headers `Atek-Auth-User` and `Atek-Auth-Service` have been added to requests sent to applications. As all requests are routed through the Atek host server, these headers are trusted.
- **Authed APIs.** Atek's APIs now enforce permissions.
- **Authed ADB APIs.** Atek DB APIs now enforce some permissions and assign ownership of databases to individual users.
- **App owners.** All applications now have an "owning user," which is the user who installed them. If an application is installed for all users (such as the core services) they use the special `system` user.
- **Per-user home apps.** The "main service" is now installed per user rather than acting as a core service.

## Today's livestream

I do a **weekly livestream every Friday at 2PM CST** ([time zone converter](https://dateful.com/time-zone-converter?t=12pm&tz2=San-Francisco-California)).
We'll do an overview of what's happened in the last week, I'll answer questions, and then we'll do some live coding.

<a href="https://youtu.be/TTAeZzjcPxQ" class="highlighted-link">👉 &nbsp;<strong>Here's the link to this Friday's Livestream</strong>&nbsp;👈</a>

Hope to see you there!

&mdash; [Paul](https://twitter.com/pfrazee)