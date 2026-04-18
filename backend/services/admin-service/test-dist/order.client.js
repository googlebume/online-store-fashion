"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderClient = void 0;
const microservices_1 = require("@nestjs/microservices");
exports.orderClient = microservices_1.ClientProxyFactory.create({
    transport: microservices_1.Transport.TCP,
    options: { host: 'localhost', port: 5006 },
});
//# sourceMappingURL=order.client.js.map