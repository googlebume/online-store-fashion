import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import {BuildOptions} from "./types/types";

export function buildDevServer(options: BuildOptions): DevServerConfiguration {
    return {
        port: options.port ?? 3000,
        /** Одне спільне вікно — лише host відкриває браузер; concurrent MF-сервіси не повинні відкривати вкладки */
        open: false,
        // если раздавать статику через nginx То надо делать проксирование на Index.html
        historyApiFallback: true,
        hot: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            /** Зменшує конфлікти FedCM / Google Sign-In з postMessage у dev */
            'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
        },
    }
}