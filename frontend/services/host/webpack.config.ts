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
    const isDev = (env.mode ?? 'development') === 'development';
    const svcUrl = (v: string | undefined) => isDev ? '' : (v?.trim() || '');

    const paths: BuildPaths = {
        output: path.resolve(__dirname, 'build'),
        entry: path.resolve(__dirname, 'src', 'index.tsx'),
        html: path.resolve(__dirname, 'public', 'index.html'),
        public: path.resolve(__dirname, 'public'),
        src: path.resolve(__dirname, 'src'),
    }
    const mfDevHost = process.env.MF_DEV_HOST ?? 'localhost'
    // In dev mode ignore .env Vercel/remote URLs — use locally-running MF services
    const remoteFallback = (envArg: string | undefined, envVar: string | undefined, localPort: number) =>
        isDev ? (envArg ?? `http://${mfDevHost}:${localPort}`) : (envArg ?? envVar ?? `http://${mfDevHost}:${localPort}`)
    const SHOP_REMOTE_URL = remoteFallback(env.SHOP_REMOTE_URL, process.env.SHOP_REMOTE_URL, 3001)
    const ADMIN_REMOTE_URL = remoteFallback(env.ADMIN_REMOTE_URL, process.env.ADMIN_REMOTE_URL, 3002)
    const PRODUCT_REMOTE_URL = remoteFallback(env.PRODUCT_REMOTE_URL, process.env.PRODUCT_REMOTE_URL, 3003)
    const AUTH_REMOTE_URL = remoteFallback(env.AUTH_REMOTE_URL, process.env.AUTH_REMOTE_URL, 3004)
    const USER_PROFILE_REMOTE_URL = remoteFallback(env.USER_PROFILE_REMOTE_URL, process.env.USER_PROFILE_REMOTE_URL, 3005)

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
            __PRODUCT_SERVICE_BASE_URL__: JSON.stringify(svcUrl(process.env.PRODUCT_SERVICE_URL)),
            __AUTH_SERVICE_URL__: JSON.stringify(svcUrl(process.env.AUTH_SERVICE_URL)),
            __ADMIN_SERVICE_URL__: JSON.stringify(svcUrl(process.env.ADMIN_SERVICE_URL)),
            __ORDER_SERVICE_URL__: JSON.stringify(svcUrl(process.env.ORDER_SERVICE_URL)),
            __ANALYTICS_SERVICE_URL__: JSON.stringify(svcUrl(process.env.ANALYTICS_SERVICE_URL)),
            __DATABASE_SERVICE_BASE_URL__: JSON.stringify(svcUrl(process.env.DATABASE_SERVICE_URL)),
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
