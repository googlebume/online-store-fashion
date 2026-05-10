import path from 'path';
import webpack from 'webpack';
import {BuildMode, BuildPaths, BuildPlatform, buildWebpack, BuildOptions} from '@packages/build-config'
import packageJson from './package.json'
import dotenv from 'dotenv'
dotenv.config({ path: path.resolve(__dirname, '.env') })

interface EnvVariables {
    mode?: BuildMode;
    analyzer?: boolean;
    port?: number;
    platform?: BuildPlatform;
    SHOP_REMOTE_URL?: string
    ADMIN_REMOTE_URL?: string
    HEADER_REMOTE_URL?: string
    PRODUCT_REMOTE_URL?: string
    AUTH_REMOTE_URL?: string
    USER_PROFILE_REMOTE_URL?: string
}

export default (env: EnvVariables) => {
    const paths: BuildPaths = {
        output: path.resolve(__dirname, 'build'),
        entry: path.resolve(__dirname, 'src', 'index.tsx'),
        html: path.resolve(__dirname, 'public', 'index.html'),
        public: path.resolve(__dirname, 'public'),
        src: path.resolve(__dirname, 'src'),
    }
    const mfDevHost = process.env.MF_DEV_HOST ?? 'localhost'
    const SHOP_REMOTE_URL = env.SHOP_REMOTE_URL ?? `http://${mfDevHost}:3001`
    const ADMIN_REMOTE_URL = env.ADMIN_REMOTE_URL ?? `http://${mfDevHost}:3002`
    const PRODUCT_REMOTE_URL = env.PRODUCT_REMOTE_URL ?? `http://${mfDevHost}:3003`
    const AUTH_REMOTE_URL = env.AUTH_REMOTE_URL ?? `http://${mfDevHost}:3004`
    const USER_PROFILE_REMOTE_URL = env.USER_PROFILE_REMOTE_URL ?? `http://${mfDevHost}:3005`

    const config: webpack.Configuration = buildWebpack({
        port: env.port ?? 3000,
        mode: env.mode ?? 'development',
        paths,
        analyzer: process.env.analyzer === 'true',
        platform: env.platform ?? 'desktop'
    })

    config.plugins.push(new webpack.container.ModuleFederationPlugin({
        name: 'host',
        filename: 'remoteEntry.js',

        remotes: {
            shop: `shop@${SHOP_REMOTE_URL}/remoteEntry.js`,
            admin: `admin@${ADMIN_REMOTE_URL}/remoteEntry.js`,
            product: `product@${PRODUCT_REMOTE_URL}/remoteEntry.js`,
            auth: `auth@${AUTH_REMOTE_URL}/remoteEntry.js`,
            user_profile: `user_profile@${USER_PROFILE_REMOTE_URL}/remoteEntry.js`,
        },
        shared: {
            ...packageJson.dependencies,
            react: {
                eager: true,
                // requiredVersion: packageJson.dependencies['react'],
            },
            'react-router-dom': {
                eager: true,
                // requiredVersion: packageJson.dependencies['react-router-dom'],
            },
            'react-dom': {
                eager: true,
                // requiredVersion: packageJson.dependencies['react-dom'],
            },
        },
    }))

    const firebaseWebConfig = {
        apiKey: process.env.FIREBASE_API_KEY ?? '',
        authDomain: process.env.FIREBASE_AUTH_DOMAIN ?? '',
        projectId: process.env.FIREBASE_PROJECT_ID ?? '',
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? '',
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? '',
        appId: process.env.FIREBASE_APP_ID ?? '',
        measurementId: process.env.FIREBASE_MEASUREMENT_ID ?? '',
    }

    config.plugins!.push(
        new webpack.DefinePlugin({
            __FIREBASE_WEB_CONFIG__: JSON.stringify(firebaseWebConfig),
        }),
    )

    if (config.devServer && typeof config.devServer === 'object') {
        config.devServer = {
            ...config.devServer,
            open: true,
        }
    }

    return config;
}
