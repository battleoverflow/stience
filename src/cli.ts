#!/usr/bin/env node

/*
    Stience CLI
    Owner: Stience (https://github.com/stience)
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
        "install dependencies",
        (argv) => {
            argv.option("production", {
                type: "boolean",
                description: "Install dependencies"
            })

            argv.boolean("save-dev")
            argv.boolean("dev")
            argv.alias("dd", "dev")

            return argv
        },
        pm
    )
    .command(
        "*",
        "Install dependencies",
        (argv) =>
            argv.option("production", {
                type: "boolean",
                description: "Install production dependencies"
            }),
        pm
    )
    .parse()
