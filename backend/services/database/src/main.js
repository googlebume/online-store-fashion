"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const database_module_1 = require("./database.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(database_module_1.DatabaseModule, {
        transport: microservices_1.Transport.TCP,
        options: { host: 'localhost', port: 5001 },
    });
    await app.listen();
    console.log('Database microservice is running on port 5001');
}
bootstrap();
//# sourceMappingURL=main.js.map