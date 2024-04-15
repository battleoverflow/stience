/*
    Owner: battleoverflow (https://github.com/battleoverflow)
    Project: Stience
    License: BSD 2-Clause
*/

import * as fs from "fs-extra"
import { exec } from "child_process"
import axios from "axios"

const dockConfig = (typeOfDockerfile: any, version: any) => {
    const dockerUrl = `https://raw.githubusercontent.com/battleoverflow/DockDB/main/DockDB/${typeOfDockerfile}/${version}/Dockerfile`

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
    fs.readFile(
        "stience.json",
        "utf-8",
        function (err: any, userConfig: string) {
            if (err) {
                // If no config file is provided, default to the example
                fs.readFile(
                    "stience.example.json",
                    "utf-8",
                    function (err: any, exampleConfig: string) {
                        if (err) throw err

                        let configRes = JSON.parse(exampleConfig)
                        dockConfig(configRes.config, configRes.version)
                        console.log(
                            "Missing 'stience.json' config. Using 'stience.example.json' file instead"
                        )
                    }
                )
                return false
            }

            let configRes = JSON.parse(userConfig)
            dockConfig(configRes.config, configRes.version)
            console.log(
                "Successfully generated Dockerfile using 'stience.json' config"
            )
        }
    )
    return true
}
