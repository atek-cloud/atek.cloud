---
sidebar_position: 2
---

# Getting started

:::caution
  **Atek is still in early development.**
  Until Atek reaches v1, users should beware of breaking changes which may not be backwards compatible.
  Atek is available now as a developer preview.
:::

You can install Atek using NPM. **You will need to install NodeJS 16+.**

```
# Requires Node 16+
npm install -g @atek-cloud/atek
```

From there, just run `atek` to start it. You'll be guided to create a user in the initial setup flow.

Once setup is finished, you can access Atek at [localhost](http://localhost).

```
open http://localhost
```

Atek will run on port 80 by default. You can change the port by [editing your config file](/docs/reference/config) or passing the [-p flag](/docs/reference/cli).

:::info Permissions Error
If you get a permissions error around accessing port 80, run the following command:
```
sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\``
```
That will enable nodejs to access port 80 without requiring super-user priviliges.
:::

Next, you might try installing the [hello world app](https://github.com/atek-cloud/hello-world-node). You can do this from the atek frontend or by calling:

```
atek install --user {your_username} https://github.com/atek-cloud/hello-world-node
```

For `your_username`, you'll use the user you created during initial setup. That tells Atek who owns the application, since you can have multiple users. Here's how I call the command, for instance:

```
atek install --user pfrazee https://github.com/atek-cloud/hello-world-node
```

Once it's installed, you can open it at [hello-world-node.localhost](http://hello-world-node.localhost).

```
open http://hello-world-node.localhost
```

## Problems?

If you run into any problems, please [file an issue](https://github.com/atek-cloud/atek/issues).

References:

- [Atek command line reference](/docs/reference/cli)
- [Configuration file reference](/docs/reference/config)

## What next?

- If you want to learn about Atek, [read the **Architecture Document**](/docs/manual/dev/architecture).
- If you want to build an application, [read the **NodeJS app guide**](/docs/manual/node/writing-a-node-app).
- If you want to get involved, [visit the **Discussions Board**](https://github.com/atek-cloud/atek/discussions).