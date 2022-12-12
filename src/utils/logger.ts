/*
    Owner: CyberSuki (https://github.com/cybersuki)
    Project: Stience
    License: BSD 2-Clause
*/

import logUpdate from "log-update"
import ProgressBar from "ascii-progress"

let progressBar: ProgressBar

// Resolve packages before installing
export function resolveLog(pkgName: string) {
    try {
        logUpdate(`[🧬] Resolving: ${pkgName}`)
    } catch (e) {
        logUpdate(`[❗] Resolving Halted: ${pkgName}`)

        if (e instanceof Error) {
            logUpdate(`[ERROR] ${e.message}`)
        }
    }
}

// Progress bar for monitoring installation
export function prepareInstallation(count: number) {
    logUpdate("[🚀] Resolving complete")
    
    progressBar = new ProgressBar({
        schema: '[:bar.green] (:current/:total) :percent :elapseds',
        total: count - 1
    })
}

// Updates the progress bar on completion
export function installationComplete() {
    progressBar.tick()
}
