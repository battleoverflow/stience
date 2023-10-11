/*
    Owner: azazelm3dj3d (https://github.com/azazelm3dj3d)
    Project: Stience
    License: BSD 2-Clause
*/

import * as fs from "fs-extra"
import { exec } from "child_process"
import axios from "axios"

const dockConfig = (typeOfDockerfile: any, version: any) => {
    const dockerUrl = `https://raw.githubusercontent.com/azazelm3dj3d/DockDB/main/DockDB/${typeOfDockerfile}/${version}/Dockerfile`

    axios({
        method: "get",
        url: dockerUrl,
        responseType: "stream"
    }).then((response: { data: { pipe: (arg0: fs.WriteStream) => void } }) => {
        response.data.pipe(fs.createWriteStream("Dockerfile"))
    })
}

export const buildDocker = () => {
    // Build Docker container
    exec("docker build . -t stience-dock", (err: any) => {
        if (err) {
            console.error(`Docker build error: ${err}`)
            return false
        }
    })
    return true
}

export default async function dock() {
    // Reads configuration file to determine Docker configuration
    fs.readFile("stience.json", "utf-8", function (err: any, config: string) {
        if (err) throw err

        let configRes = JSON.parse(config)

        dockConfig(configRes.config, configRes.version)
    })
}
