// import { ModuleOptions } from "webpack";
// import MiniCssExtractPlugin from "mini-css-extract-plugin";
// import ReactRefreshTypeScript from "react-refresh-typescript";
// import { BuildOptions } from "./types/types";
// import { buildBabelLoader } from "./babel/buildBabelLoader";

// export function buildLoaders(options: BuildOptions): ModuleOptions['rules'] {
//     const isDev = options.mode === 'development';

//     const assetLoader = {
//         test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
//         type: 'asset/resource',
//     }

//     // const svgrLoader = {
//     //     test: /\.svg$/i,
//     //     use: [
//     //         {
//     //             loader: '@svgr/webpack',
//     //             options: {
//     //                 icon: true,
//     //                 svgoConfig: {
//     //                     plugins: [
//     //                         {
//     //                             name: 'convertColors',
//     //                             params: {
//     //                                 currentColor: true,
//     //                             }
//     //                         }
//     //                     ]
//     //                 }
//     //             }
//     //         }
//     //     ],
//     // }
//     // const svgLoader = {
//     //     test: /\.svg$/,
//     //     type: 'asset/resource',
//     //     issuer: { not: /\.[jt]sx?$/ }
//     //   }

//     const svgrLoader = {
//         test: /\.svg$/i,
//         resourceQuery: { not: [/url/] }, // виключаємо файли з ?url
//         use: [
//             {
//                 loader: '@svgr/webpack',
//                 options: {
//                     icon: true,
//                     svgoConfig: {
//                         plugins: [
//                             {
//                                 name: 'convertColors',
//                                 params: {
//                                     currentColor: true,
//                                 }
//                             }
//                         ]
//                     }
//                 }
//             }
//         ],
//     }

//     const svgLoader = {
//         test: /\.svg$/,
//         resourceQuery: /url/, // тільки для файлів з ?url
//         type: 'asset/resource',
//         generator: {
//             filename: 'images/[name].[hash][ext]'
//         }
//     }

//     const cssLoaderWithModules = {
//         loader: "css-loader",
//         options: {
//             modules: {
//                 localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64:8]'
//             },
//         },
//     }

//     const scssLoader = {
//         test: /\.s[ac]ss$/i,
//         use: [
//             // Creates `style` nodes from JS strings
//             isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
//             // Translates CSS into CommonJS
//             cssLoaderWithModules,
//             // Compiles Sass to CSS
//             "sass-loader",

//         ],
//     }




//     const tsLoader = {
//         // ts-loader умеет работать с JSX
//         // Если б мы не использовали тайпскрипт: нужен был бы babel-loader
//         exclude: /node_modules/,
//         test: /\.(j|t)sx?$/,  // /\.tsx?$/
//         use: [
//             {
//                 loader: 'ts-loader',
//                 options: {
//                     transpileOnly: true,
//                     getCustomTransformers: () => ({
//                         before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
//                     }),
//                 }
//             }
//         ]
//     }

//     // const babelLoader = buildBabelLoader(options);


//     return [
//         assetLoader,
//         scssLoader,
//         tsLoader,
//         svgrLoader?
//         // babelLoader,
//         svgLoader
//     ]
// }


import { ModuleOptions } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ReactRefreshTypeScript from "react-refresh-typescript";
import { BuildOptions } from "./types/types";
import { buildBabelLoader } from "./babel/buildBabelLoader";

export function buildLoaders(options: BuildOptions): ModuleOptions['rules'] {
    const isDev = options.mode === 'development';

    const assetLoader = {
        test: /\.(png|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
    }

    // SVG як React компонент (має бути ПЕРШИМ для SVG)
    const svgrLoader = {
        test: /\.svg$/,
        resourceQuery: { not: [/url/] }, // виключаємо файли з ?url
        use: [
            {
                loader: '@svgr/webpack',
                options: {
                    icon: true,
                    svgoConfig: {
                        plugins: [
                            {
                                name: 'convertColors',
                                params: {
                                    currentColor: true,
                                }
                            }
                        ]
                    }
                }
            }
        ],
    }

    // SVG як asset (має бути ДРУГИМ для SVG)
    const svgLoader = {
        test: /\.svg$/,
        resourceQuery: /url/, // тільки для файлів з ?url
        type: 'asset/resource',
        generator: {
            filename: 'images/[name].[hash][ext]'
        }
    }

    const cssLoaderWithModules = {
        loader: "css-loader",
        options: {
            modules: {
                localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64:8]'
            },
        },
    }

    const scssLoader = {
        test: /\.s[ac]ss$/i,
        use: [
            // Creates `style` nodes from JS strings
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            // Translates CSS into CommonJS
            cssLoaderWithModules,
            // Compiles Sass to CSS
            "sass-loader",
        ],
    }
        
    const tsLoader = {
        // ts-loader умеет работать с JSX
        // Если б мы не использовали тайпскрипт: нужен был бы babel-loader
        exclude: /node_modules/,
        test: /\.(j|t)sx?$/,  // /\.tsx?$/
        use: [
            {
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    getCustomTransformers: () => ({
                        before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
                    }),
                }
            }
        ]
    }

    // const babelLoader = buildBabelLoader(options);

    return [
        // 1. СПОЧАТКУ JS/TS лоадери (найвища пріоритетність)
        tsLoader,
        // babelLoader,
        
        // 2. ПОТІМ SVG лоадери (порядок важливий!)
        svgrLoader,  // Спочатку SVGR (для React компонентів)
        svgLoader,   // Потім asset loader (для ?url)
        
        // 3. ПОТІМ CSS/SCSS лоадери
        scssLoader,
        
        // 4. НАРЕШТІ asset лоадери (найнижча пріоритетність)
        assetLoader,
    ]
}