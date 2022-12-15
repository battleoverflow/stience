/*
    Owner: Hifumi1337 (https://github.com/hifumi1337)
    Project: Stience
    License: BSD 2-Clause
*/

import * as fs from "fs-extra"
import { exec } from "child_process"

const dockConfig = () => {
    // TODO: Add network download request to download specified Dockerfile from stience.json
    // This should be located on GitHub (repo), allowing a raw download

    // Build Docker container
    exec('docker build . -t stience-dock', (err, stdout, stderr) => {
        if (err) {
          console.error(`exec error: ${err}`)
          return
        }

        console.log(`stdout: ${stdout}`)
        console.error(`stderr: ${stderr}`)
    })

    // Run Docker container
    exec('docker run -p 0.0.0.0:1337:1337 stience-dock', (err, stdout, stderr) => {
        if (err) {
          console.error(`exec error: ${err}`)
          return
        }

        console.log(`stdout: ${stdout}`)
        console.error(`stderr: ${stderr}`)
    })
}

export default async function() {
    // Reads configuration file to determine Docker configuration
    fs.readFile("stience.json", "utf-8", function(err: any, config: string) {
        if (err) throw err

        let configRes = JSON.parse(config)

        switch (configRes.config) {
            case "node":
                console.log("Docker container running: http://localhost:1337")
                dockConfig()
        }
    });
}
