<h1 align="center">
    <img src="https://raw.githubusercontent.com/azazelm3dj3d/stience/main/.github/assets/stience_logo.png" />
</h1>

<p align="center">
    <b>Stience CLI is currently in an early alpha state, which means it may break.</b>
</p>

Stience is a web development and maintenance CLI created for developers to better focus on their project, not the setup.

Stience is a containerized package and dependecy manager. Stience was created to assist developers with maintaining and optimizing their local development environment. Stience CLI currently uses a Docker approach, offering a custom Docker container for `node_modules` and your app. The architecture is simple. The CLI currently offers two seperate parent commands, `install` and `dock`. The install command works just like `npm` or `yarn`, it installs packages based on the `package.json` file and then populates the `node_modules` directory. The dock command builds a Docker container, hosting the `node_modules` in a container.

You can choose which Dockerfile to download using the `stience.json` file.

## Usage

NOTE: All versions before `v0.0.7` will not work.

Install the CLI tool globally:

```bash
npm install stience@latest -g
```

## Commands

### Install

Depending on how you have your PATH configured, you can run Stience by using npx or directly:

```bash
stience install <PackageName>
```

If you already have a `package.json` file present, you can run `install` command like normal:

```bash
stience install
```

NOTE: The CLI automatically attempts to locate the `package.json` in the current working directory

### Dock

You can pull down a preconfigured Dockerfile using the following command:

```bash
stience dock create
```

If you need to build the Docker container:

```bash
stience dock build
```
