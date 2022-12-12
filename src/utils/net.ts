/*
    Owner: CyberSuki (https://github.com/cybersuki)
    Project: Stience
    License: BSD 2-Clause
*/

// NOTE: This file uses JSON data, so the `name` and `version` data points are not the same as `pkgName` and `pkgVersion`. They get assigned later.

import fetch from "node-fetch"

export interface PackageData {
    [pkgVersion: string]: {
        dependencies?: {
            [dep: string]: string
        }

        dist: {
            shasum: string
            tarball: string
        }
    }
}

// NPM registry
const REGISTRY_URL = process.env.REGISTRY_URL || "https://registry.npmjs.org/"

// Sets up cache to minimize network requests
const cache: {
    [dep: string]: PackageData
} = Object.create(null)

export default async function (name: string): Promise<PackageData> {
    // Checks if the package pkgName already exists in the cache
    if (cache[name]) return cache[name]

    // Handles the package collection & json conversion
    const res = await fetch(`${REGISTRY_URL}${name}`)
    const jsonData = await res.json()

    // If a package does not exist
    if (jsonData.error) {
        throw new ReferenceError(`[❗] Unable to locate package: ${name}`)
    }

    // Includes the interface PackageData within the cache
    return (cache[name] = jsonData.versions)
}
