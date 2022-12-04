# Stience

Stience is a containerized package & dependecy manager

Stience was created to assist developers in maintaing their projects using a Dockerized approach. The Stience is still in a very early alpha state, so expect breaking changes.

Currently, the CLI can only install packages from NPM registry.

### Usage

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
