"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseClient = void 0;
const microservices_1 = require("@nestjs/microservices");
exports.databaseClient = microservices_1.ClientProxyFactory.create({
    transport: microservices_1.Transport.TCP,
    options: { host: 'localhost', port: 5001 },
});
//# sourceMappingURL=database.client.js.map