# Dive In

A Docker extension that helps you explore a docker image, layer contents, and discover ways to shrink the size of your Docker/OCI image.

Built on the top of excellent CLI tool - https://github.com/wagoodman/dive

![i1](screenshots/1.png)
![i2](screenshots/2.png)

## Installation

Make sure your Docker desktop supports extensions. This extension can be installed from [Docker Hub] (https://hub.docker.com/extensions/prakhar1989/dive-in) or in Docker Desktop. 

## Development

Go through [the official docs](https://docs.docker.com/desktop/extensions-sdk/quickstart/) to understand the basic setting up of the Docker extension.

### Local development

Prereqs: Docker Desktop (extensions enabled), Node.js 20+, Go (per `vm/go.mod`).

1. Install UI dependencies: `npm --prefix ui install`
2. Build the UI: `npm --prefix ui run build`
3. Build the extension image: `docker build -t dive-in:dev .`
4. Load the local extension into Docker Desktop: `docker extension install dive-in:dev`

To update a local install, rebuild and re-run the install command.

Useful commands for setting up debugging

```
$ npm --prefix ui run dev
$ docker extension dev debug dive-in:dev
$ docker extension dev ui-source dive-in:dev http://localhost:5173
```

Make sure you run `npm run dev` in the `ui/` folder.
