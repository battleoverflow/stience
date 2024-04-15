/*
    Owner: battleoverflow (https://github.com/battleoverflow)
    Project: Stience
    License: BSD 2-Clause
*/

import * as fs from "fs-extra"
import * as tar from "tar"
import * as log from "../utils/logger"

import fetch from "node-fetch"

export default async function (pkgName: string, pkgUrl: string, loc = "") {
    // Set node_modules directory for installation
    const installPath = `${process.cwd()}${loc}/node_modules/${pkgName}`

    // Create assigned directories for packages
    await fs.mkdirp(installPath)

    // Fetches packages
    const res = await fetch(pkgUrl)

    // Reads + extracts response data stream
    res.body
        .pipe(
            tar.extract({
                cwd: installPath,
                strip: 1
            })
        )
        .on("close", log.installationComplete)
    // Make sure to update progress bar
}
