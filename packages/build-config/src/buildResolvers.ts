import {Configuration} from "webpack";
import {BuildOptions} from "./types/types";
import path from "path";

export function buildResolvers(options: BuildOptions): Configuration['resolve'] {
    return {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.png', '.jpg', '.jpeg', '.svg'],
        alias: {
            '@': options.paths.src,
            "@shop": path.resolve(__dirname, "../../services/shop/src"),
            "@product/": path.resolve(__dirname, "../../services/product/src"),
        },
    }
}