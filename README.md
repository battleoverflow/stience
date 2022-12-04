# Stience

Stience is a containerized package & dependecy manager

Stience was created to assist developers in maintaing their projects using a Dockerized approach. The Stience CLI is still in a very early alpha state, so expect breaking changes when using.

### Usage

NOTE: All versions prior to `v0.0.7` will not work at all.

Install the CLI tool globally:
```bash
npm install stience@latest -g
```

Depending on how you've got your PATH configured, you can run Stience by using npx or directly:
```bash
# Example 1
stience install <PackageName>

# Example 2
npx stience install <PackageName>
```

If you already have a `package.json` file present, you can just run install like normal:
```bash
stience install
```
