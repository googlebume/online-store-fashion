import {Configuration} from "webpack";
import {BuildOptions} from "./types/types";
import path from "path";

export function buildResolvers(options: BuildOptions): Configuration['resolve'] {
    return {
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.scss', '.css'],
        alias: {
            '@': options.paths.src,
            '@packages': path.resolve(__dirname, '../../packages'), // Вказує на корінь `packages`
        },
    }
}