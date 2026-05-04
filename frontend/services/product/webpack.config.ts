import path from 'path';
import webpack from 'webpack';
import dotenv from 'dotenv';
import {BuildMode, BuildPaths, BuildPlatform, buildWebpack, BuildOptions} from '@packages/build-config'
import packageJson from './package.json'

dotenv.config({ path: path.resolve(__dirname, '.env') });

interface EnvVariables {
    mode?: BuildMode;
    analyzer?: boolean;
    port?: number;
    platform?: BuildPlatform;
}

export default (env: EnvVariables) => {
    const paths: BuildPaths = {
        output: path.resolve(__dirname, 'build'),
        entry: path.resolve(__dirname, 'src', 'index.tsx'),
        html: path.resolve(__dirname, 'public', 'index.html'),
        public: path.resolve(__dirname, 'public'),
        src: path.resolve(__dirname, 'src'),
    }

    const config: webpack.Configuration = buildWebpack({
        port: env.port ?? 3003,
        mode: env.mode ?? 'development',
        paths,
        analyzer: env.analyzer,
        platform: env.platform ?? 'desktop',
    })

    config.plugins.push(new webpack.container.ModuleFederationPlugin({
        name: 'product',
        filename: 'remoteEntry.js',
        exposes: {
            './Router': './src/router/Router.tsx',
        },
        shared: {
            ...packageJson.dependencies,
            react: {
                eager: true,
                requiredVersion: packageJson.dependencies['react'],
            },
            'react-router-dom': {
                eager: true,
                requiredVersion: packageJson.dependencies['react-router-dom'],
            },
            'react-dom': {
                eager: true,
                requiredVersion: packageJson.dependencies['react-dom'],
            },
        },
    }))

    const productBase =
        process.env.PRODUCT_SERVICE_URL?.trim() ||
        process.env.VITE_PRODUCT_SERVICE_URL?.trim() ||
        ''

    config.plugins!.push(
        new webpack.DefinePlugin({
            __PRODUCT_SERVICE_BASE_URL__: JSON.stringify(productBase),
        }),
    )

    return config;
}

