/*
    Owner: battleoverflow (https://github.com/battleoverflow)
    Project: Stience
    License: BSD 2-Clause
*/

import * as semver from "semver"
import net from "./net"
import * as log from "./logger"
import * as lock from "./lockControl"

interface DependenciesMap {
    [dependency: string]: string
}

type DependencyStack = Array<{
    pkgName: string
    pkgVersion: string
    dependencies: { [dep: string]: string }
}>

export interface PackageFile {
    dependencies?: DependenciesMap
    devDependencies?: DependenciesMap
}

// Avoids package duplication
const topLevel: {
    [pkgName: string]: { pkgUrl: string; pkgVersion: string }
} = Object.create(null)

// Assists with dependency conflicts
const unsatisfied: Array<{
    pkgName: string
    pkgParent: string
    pkgUrl: string
}> = []

async function collectDeps(
    pkgName: string,
    constraint: string,
    stack: DependencyStack = []
) {
    // Begins to access lock information
    const fromLock = lock.retrievePkgs(pkgName, constraint)

    // Checks if the lock information for the package exists
    // If not, runs a network request to npm
    const manifest = fromLock || (await net(pkgName))

    log.resolveLog(pkgName)

    const pkgVersions = Object.keys(manifest)

    // Uses the latest semantic version for the package
    const pkgFound = constraint
        ? semver.maxSatisfying(pkgVersions, constraint)
        : pkgVersions[pkgVersions.length - 1]
    if (!pkgFound) {
        throw new Error("Unable to resolve package")
    }

    // Checks if the packages exists
    if (!topLevel[pkgName]) {
        topLevel[pkgName] = {
            pkgUrl: manifest[pkgFound].dist.tarball,
            pkgVersion: pkgFound
        }
    } else if (semver.satisfies(topLevel[pkgName].pkgVersion, constraint)) {
        const conflictIdx = checkStackDependencies(pkgName, pkgFound, stack)
        if (conflictIdx === -1) return

        // Helps prevents issues when working with the dependencies of the dependencies
        unsatisfied.push({
            pkgName,
            pkgParent: stack
                .map(({ pkgName }) => pkgName)
                .slice(conflictIdx - 2)
                .join("/node_modules/"),
            pkgUrl: manifest[pkgFound].dist.tarball
        })
    } else {
        // Package already exists, but conflicts were found
        unsatisfied.push({
            pkgName,
            pkgParent: stack[stack.length - 1].pkgName,
            pkgUrl: manifest[pkgFound].dist.tarball
        })
    }

    const dependencies = manifest[pkgFound].dependencies || null

    // Save to a new stience.lock file
    lock.createOrUpdate(`${pkgName}@${constraint}`, {
        pkgVersion: pkgFound,
        pkgUrl: manifest[pkgFound].dist.tarball,
        shasum: manifest[pkgFound].dist.shasum,
        dependencies
    })

    if (dependencies) {
        stack.push({
            pkgName,
            pkgVersion: pkgFound,
            dependencies
        })
        await Promise.all(
            Object.entries(dependencies)
                .filter(([dep, range]) => !depsCirculuation(dep, range, stack))
                .map(([dep, range]) => collectDeps(dep, range, stack.slice()))
        )
        stack.pop()
    }

    if (!constraint) {
        return { pkgName, pkgVersion: `^${pkgFound}` }
    }
}

// Checks for conflicts in the dependencies of the dependencies
function checkStackDependencies(
    pkgName: string,
    pkgVersion: string,
    stack: DependencyStack
) {
    return stack.findIndex(({ dependencies }) => {
        if (!dependencies[pkgName]) return true
        return semver.satisfies(pkgVersion, dependencies[pkgName])
    })
}

function depsCirculuation(
    pkgName: string,
    range: string,
    stack: DependencyStack
) {
    return stack.some(
        (pkgItem) =>
            pkgItem.pkgName === pkgName &&
            semver.satisfies(pkgItem.pkgVersion, range)
    )
}

export default async function (rootManifest: PackageFile) {
    if (rootManifest.dependencies) {
        ;(
            await Promise.all(
                Object.entries(rootManifest.dependencies).map((pair) =>
                    collectDeps(...pair)
                )
            )
        )
            .filter(Boolean)
            .forEach(
                (pkgItem) =>
                    (rootManifest.dependencies![pkgItem!.pkgName] =
                        pkgItem!.pkgVersion)
            )
    }

    if (rootManifest.devDependencies) {
        ;(
            await Promise.all(
                Object.entries(rootManifest.devDependencies).map((pair) =>
                    collectDeps(...pair)
                )
            )
        )
            .filter(Boolean)
            .forEach(
                (pkgItem) =>
                    (rootManifest.devDependencies![pkgItem!.pkgName] =
                        pkgItem!.pkgVersion)
            )
    }

    return { topLevel, unsatisfied }
}
