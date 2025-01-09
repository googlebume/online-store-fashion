// import {BuildOptions} from "../types/types";
// import {removeDataTestIdBabelPlugin} from "./removeDataTestIdBabelPlugin";

// export function buildBabelLoader({mode}: BuildOptions) {
//     const isDev = mode === 'development';
//     const isProd= mode === 'production';

//     const plugins = [];

//     if(isProd) {
//         plugins.push([
//             removeDataTestIdBabelPlugin,
//             {
//                 props: ['data-testid']
//             }
//         ])
//     }

//     return {
//         test: /\.tsx?$/,
//         exclude: /node_modules/,
//         use: {
//             loader: "babel-loader",
//             options: {
//                 presets: [
//                     '@babel/preset-env',
//                     "@babel/preset-typescript",
//                     [
//                         "@babel/preset-react",
//                         {
//                             runtime: isDev ? 'automatic' : 'classic',
//                         }
//                     ]
//                 ],
//                 plugins: plugins.length ? plugins : undefined,
//             }
//         }
//     }
// }

import { BuildOptions } from "../types/types";
import { removeDataTestIdBabelPlugin } from "./removeDataTestIdBabelPlugin";

export function buildBabelLoader({ mode }: BuildOptions) {
    const isDev = mode === "development";
    const isProd = mode === "production";

    const plugins = [];

    if (isProd) {
        plugins.push([
            removeDataTestIdBabelPlugin,
            {
                props: ["data-testid"],
            },
        ]);
    }

    return {
        test: /\.(j|t)sx?$/, // Додано підтримку .jsx та .tsx файлів
        exclude: /node_modules/,
        use: {
            loader: "babel-loader",
            options: {
                presets: [
                    "@babel/preset-env", // Для сучасного JavaScript
                    "@babel/preset-typescript", // Для TypeScript
                    [
                        "@babel/preset-react", // Для React та JSX
                        {
                            runtime: isDev ? "automatic" : "classic",
                        },
                    ],
                ],
                plugins: plugins.length ? plugins : undefined,
            },
        },
    };
}
