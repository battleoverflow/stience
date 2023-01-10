/*
    Owner: azazelm3dj3d (https://github.com/azazelm3dj3d)
    Project: Stience
    License: BSD 2-Clause
*/

import * as fs from "fs-extra"
import { exec } from "child_process"
import axios from 'axios'

const dockConfig = () => {
    const dockerUrl = 'https://raw.githubusercontent.com/shinigamilib/DockDB/main/DockDB/node/19/Dockerfile';

    axios({
        method: 'get',
        url: dockerUrl,
        responseType: 'stream'
    }).then((response: { data: { pipe: (arg0: fs.WriteStream) => void; }; }) => {
        response.data.pipe(fs.createWriteStream('Dockerfile'));
    });

    
    // Build Docker container
    exec('docker build . -t stience-dock', (err) => {
        if (err) {
          console.error(`Docker build error: ${err}`)
          return
        }
    })

    // Run Docker container
    exec('docker run -p 0.0.0.0:1337:1337 stience-dock', (err) => {
        if (err) {
          console.error(`Docker run error: ${err}`)
          return
        }
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
