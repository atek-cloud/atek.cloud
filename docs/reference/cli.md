---
sidebar_position: 1
---

# CLI

If you've installed Atek via the [Getting started](/docs/manual/getting-started) instructions, then you should have the `atek` command available in your system.

```
atek - Run the atek server

    --version, -v         Print the current version
    --port                Set the port to run the server on (defaults to 80)
    --domain              Set the domain the server will be accessed by (defaults to "localhost")
    --configDir           Set the directory to read configuration from (defaults to "~/.atek")

Commands:
   atek run - Run the atek server
   atek install {url_or_path} - Install a new service
   atek uninstall {id} - Uninstall a service
   atek update {id} - Update a service installation from its source
   atek ls - List active services
   atek get {id} - Get info about a service
   atek cfg {id} ... - Configure a service or get its current configuration
   atek start {id} - Start a service
   atek stop {id} - Stop a service
   atek restart {id} - Restart a service
   atek repl - Connect a repl to the atek instance
```

All commands support `-h/--help` and should be easy to understand with a few exceptions.

The `atek cfg` command allows you to change settings and set environment variables which will be passed to a service. To see a service's current config, run:

```
atek cfg {id}
```

To modify a value, run:

```
atek cfg {id} --{key} {value}
```

You can modify multiple values in one call:

```
atek cfg {id} --{key1} {value1} --{key2} {value2}
```

Environment variables are stored under the `config.` namespace. Here's an example call which sets the port and the `DEBUG_MODE` env variable of a service called "test".

```
atek cfg test --port 1234 --config.DEBUG_MODE 1
```