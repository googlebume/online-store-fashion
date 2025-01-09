import {Configuration} from "webpack";
import {BuildOptions} from "./types/types";
import path from "path";

export function buildResolvers(options: BuildOptions): Configuration['resolve'] {
    return {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        alias: {
            '@': options.paths.src,
            '@unitsPackages': path.resolve(__dirname, 'packages/shared/src/utils'),
        },
    }
}