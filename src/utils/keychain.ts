/*
    Owner: azazelm3dj3d (https://github.com/azazelm3dj3d)
    Project: Stience
    License: BSD 2-Clause
*/

// Used for sorting & formatting dependencies in the package.json file
export function sortKeys<T extends { [key: string]: any }>(obj: T) {
    return Object.keys(obj)
        .sort()
        .reduce((total: T, cur) => {
            ;(total[cur] as T) = obj[cur]
            return total
        }, Object.create(null))
}
