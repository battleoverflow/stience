/*
    Owner: Hifumi1337 (https://github.com/hifumi1337)
    Project: Stience
    License: BSD 2-Clause
*/

import * as fs from "fs-extra"
import * as yaml from "js-yaml"

import * as chain from "../utils/keychain"
import { PackageData } from "./net"

// Lock definition
interface LockFile {
    [index: string]: {
        pkgVersion: string
        pkgUrl: string
        shasum: string
        dependencies: {
            [dependency: string]: string
        }
    }
}

// Read-only
const oldLockFile: LockFile = Object.create(null)

// Write-only
const newLockFile: LockFile = Object.create(null)

// Create/Update lock file with new information from most recent generation
export function createOrUpdate(pkgName: string, depsInfo: object) {
    // Checks if the package information is already present
    // If not, create it
    if (!newLockFile[pkgName]) {
        newLockFile[pkgName] = Object.create(null)
    }

    // Update the information here
    Object.assign(newLockFile[pkgName], depsInfo)
}

// Retrieves information about the package & pkgVersion
export function retrievePkgs(
    pkgName: string,
    constraint: string
): PackageData | null {
    // Key assignment
    const pkgItem = oldLockFile[`${pkgName}@${constraint}`]

    if (!pkgItem) return null

    // Data conversion to meet Stience specifications
    return {
        [pkgItem.pkgVersion]: {
            dependencies: pkgItem.dependencies,
            dist: {
                shasum: pkgItem.shasum,
                tarball: pkgItem.pkgUrl
            }
        }
    }
}

// Save lock file
export async function writeLockFile() {
    // Sort lock file keys
    await fs.writeFile(
        "./stience.lock",
        yaml.safeDump(chain.sortKeys(newLockFile), {
            noRefs: true
        })
    )
}

// Read lock file
export async function readLockFile() {
    // Checks if the lock file exists
    if (await fs.pathExists("./stience.lock")) {
        Object.assign(
            oldLockFile,
            yaml.safeLoad(await fs.readFile("./stience.lock", "utf-8"))
        )
    }
}
