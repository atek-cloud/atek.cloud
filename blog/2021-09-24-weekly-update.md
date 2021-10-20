---
slug: weekly-update-sep24-2021
title: "Weekly Update: Getting Atek DB right"
description: Loosening up the schema model a little more
author: Paul Frazee
author_title: Atek Core Team
author_url: https://twitter.com/pfrazee
author_image_url: https://avatars.githubusercontent.com/u/1270099?v=4
image: "/img/blog/weekly-update-card.png"
tags: [weekly-update]
---

We're still heads down on work today, so instead of a release overview I'm going to talk about the work in-progress with Atek DB.

:::tip Self-host your life!
Atek is a convenient platform for running NodeJS applications at home or in the cloud using peer-to-peer technology. [Learn more](/).
:::

## Problems discovered while dogfooding

While building an [**RSS Reader example app**](https://github.com/atek-cloud/rss-reader-example-app) last week, I ran into **complexity** (!) using Atek DB's schema system.

**The context**: I needed to tweak the RSS Reader's data schemas during development.
As I worked, I needed to add and modify the records' fields &mdash; a very typical workflow for an app in development.

**The problem**: Atek DB "installs" the schemas into its databases.
It will only modify update the schema if a revision number is incremented.
That meant I needed to increment its revision number with every change.

Is this so bad?
With traditional strict-schema databases, you'd use database commands to create and destroy schemas/tables.
Your code would probably include table migraters, with ways to go "up" and "down" the schema versions.
If I was totally sold on Atek's strict schema model, I'd have solved the issue by adding something similar.
The problem is, I wasn't sold on strict schemas.

## Schema madness

Prior to putting up Atek's site, there were multiple major refactors around how RPC and Database schemas work.
The initial concept was to be extremely strict: schemas would be published at URLs.
Those schemas would be canonical.
Any API or Table using them would have to conform.

My expectation was that strict, well-coordinated schemas would help people write compatible software, but after working even a few moments with the first iteration, I realized the system was hard to learn and hard to use.
The strictness wasn't helping me; it was paternalistically getting in my way.
I hate that and I know other coders hate that.
We want tools, not rules.

Each refactor would loosen the rules and reduce the complexity.
By the time Atek's site went up, the API schemas had no baked-in enforcement, and Atek DB did it minimally: table schemas were installed in a database and then enforced, but not by fetching from a canonical URL.

Still, I was a little troubled by this final model.
The stateful schema installation *without* the canonical schemas meant it would be really easy for developers to clobber each others work.
We really had the worst of both worlds: stateful strictness without tooling to help with coordination.

## A better pattern emerges

As it turns out, the way that ADB Table schemas got distributed were as NPM modules.
It's actually kind of neat: you import the module and then it "operates" on your table.

```js
import adb from '@atek-cloud/adb-api'
import {subscriptions, feedItems} from 'rss-example-tables'

const maindb = adb.db('maindb')

const subRecord = await subscriptions(maindb).create({
  feedUrl: '...',
  title: '...',
  description: '...',
  link: '...',
})
const {records} = await feedItems(maindb).list()
```

With this model, I started to realize that installing the schemas to the database was totally unnecessary.
The schema modules can do the validation themselves, outside of the Atek DB process, if they so choose.
Therefore I chose to strip out Atek DB's entire concept of tables and schemas, and make it a much more direct passthrough to [Hyperbee](https://github.com/hypercore-protocol/hyperbee).

This gets a lot closer to tools, not rules.
If you need schema validation, great!
The `adb-api` module has some pretty good helpers for doing that.
If not, skip it and use your own solutions to validation.

Loosening the schema model has been this week's project, and *should* be published and documented next week.

## Today's livestream

I do a **weekly livestream every Friday at 2PM CST** ([time zone converter](https://dateful.com/time-zone-converter?t=12pm&tz2=San-Francisco-California)).
I'll talk about everything in this post and a little more there, so please join us!

<a href="https://www.youtube.com/watch?v=DMaagdz5mpk" class="highlighted-link">👉 &nbsp;<strong>Here's the link to this Friday's Livestream</strong>&nbsp;👈</a>

Hope to see you there!

&mdash; [Paul](https://twitter.com/pfrazee)