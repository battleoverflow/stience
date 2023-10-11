/*
    Owner: azazelm3dj3d (https://github.com/azazelm3dj3d)
    Project: Stience
    License: BSD 2-Clause
*/

/* External Dependencies */
import findUp from "find-up"
import * as fs from "fs-extra"
import yargs from "yargs"

/* Internal Dependencies */
import * as lock from "./utils/lockControl"
import * as log from "./utils/logger"
import install from "./cmd/install"
import * as dock from "./cmd/dock"
import pkgManager, { PackageFile } from "./utils/pkgManager"
import * as chain from "./utils/keychain"

export default async function (args: yargs.Arguments) {
    // Checks which argument is being passed in CLI
    if (args._[0] == "dock") {
        // Runs docker command for external package access

        if (args._[1] == "create") {
            await dock.default()
        }

        if (args._[1] == "build") {
            if (dock.buildDocker()) {
                console.log(
                    "Successfully built Docker container! Taking care of a few things..."
                )
            }
        }
    } else {
        // Locate package.json file
        const packagePath = (await findUp("package.json"))!
        const currentDir = await fs.readJson(packagePath)

        // Installation structure
        // Syntax: stience install PackageName
        const newPackage = args._.slice(1)

        if (newPackage.length) {
            if (args["save-dev"] || args.dev) {
                currentDir.devDependencies = currentDir.devDependencies || {}

                // Version will populate once the package has been retrieved
                newPackage.forEach(
                    (pkg) => (currentDir.devDependencies[pkg] = "")
                )
            } else {
                currentDir.dependencies = currentDir.dependencies || {}

                // Same as dev dependencies - populate once pulled
                newPackage.forEach((pkg) => (currentDir.dependencies[pkg] = ""))
            }
        }

        // Production dependencies
        if (args.prodDeps) delete currentDir.devDependencies

        // Read the present lock file (*.lock)
        await lock.readLockFile()

        // Collects the dependency information
        const depsInfo = await pkgManager(currentDir)

        // Save/Update the present lock file
        lock.writeLockFile()

        // Configure progress bar for improved output
        log.prepareInstallation(
            Object.keys(depsInfo.topLevel).length + depsInfo.unsatisfied.length
        )

        // Installation logic for top level packages
        await Promise.all(
            Object.entries(depsInfo.topLevel).map(([pkgName, { pkgUrl }]) =>
                install(pkgName, pkgUrl)
            )
        )

        // Installation logic for packages with conflicts
        await Promise.all(
            depsInfo.unsatisfied.map(
                (pkgItem: {
                    pkgName: string
                    pkgUrl: string
                    pkgParent: any
                }) =>
                    install(
                        pkgItem.pkgName,
                        pkgItem.pkgUrl,
                        `/node_modules/${pkgItem.pkgParent}`
                    )
            )
        )

        // Make it pretty
        makeItPretty(currentDir)

        // Write new data to package.json
        fs.writeJson(packagePath, currentDir, { spaces: 2 })
    }
}

// Improve appearence for certain fields within the package.json file
const makeItPretty = (packageFile: PackageFile) => {
    if (packageFile.dependencies) {
        packageFile.dependencies = chain.sortKeys(packageFile.dependencies)
    }

    if (packageFile.devDependencies) {
        packageFile.devDependencies = chain.sortKeys(
            packageFile.devDependencies
        )
    }
}
