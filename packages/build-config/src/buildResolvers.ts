import {Configuration} from "webpack";
import {BuildOptions} from "./types/types";
import path from "path";

export function buildResolvers(options: BuildOptions): Configuration['resolve'] {
    return {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".scss"],
        alias: {
            '@': options.paths.src,
        },
    }
}