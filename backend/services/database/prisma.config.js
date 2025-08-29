"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@prisma/config");
exports.default = (0, config_1.defineConfig)({
    schema: './prisma/schema.prisma',
    migrations: {
        path: './prisma/migrations',
        seed: "ts-node prisma/seed.ts",
    }
});
//# sourceMappingURL=prisma.config.js.map