#!/usr/bin/env node

/*
    Owner: battleoverflow (https://github.com/battleoverflow)
    Project: Stience
    License: BSD 2-Clause
*/

import yargs from "yargs"
import pm from "."

/* Command Line Interface */

// This file contains all of the argument parsing logic for Stience CLI

yargs
    .usage("stience <option> [args]")
    .version()
    .alias("v", "version")
    .help()
    .alias("h", "help")
    .command(
        "install",
        "Install package dependencies",
        (argv) => {
            argv.option("production", {
                type: "boolean",
                description: "Install package dependencies"
            })

            argv.boolean("save-dev")
            argv.boolean("dev")
            argv.alias("dd", "dev")

            return argv
        },
        pm
    )
    .command(
        "dock",
        "Install package dependencies inside of Docker",
        (argv) =>
            argv.option("docker", {
                type: "boolean",
                description: "Install package dependencies inside of Docker"
            }),
        pm
    )
    .command(
        "*",
        "Install package dependencies",
        (argv) =>
            argv.option("production", {
                type: "boolean",
                description: "Install production package dependencies"
            }),
        pm
    )
    .parse()
