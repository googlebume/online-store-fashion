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
        port: env.port ?? 3005,
        mode: env.mode ?? 'development',
        paths,
        analyzer: env.analyzer,
        platform: env.platform ?? 'desktop'
    })

    config.plugins!.push(new webpack.DefinePlugin({
        __AUTH_SERVICE_URL__: JSON.stringify(process.env.AUTH_SERVICE_URL?.trim() || ""),
        __ORDER_SERVICE_URL__: JSON.stringify(process.env.ORDER_SERVICE_URL?.trim() || ""),
        __ANALYTICS_SERVICE_URL__: JSON.stringify(process.env.ANALYTICS_SERVICE_URL?.trim() || ""),
    }))

    config.plugins.push(new webpack.container.ModuleFederationPlugin({
        name: 'user_profile',
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

    return config;
}

