/** Інжекційні токени TCP-клієнтів до database-service (5001) та order-service (5006). */
export const DATABASE_SERVICE = 'DATABASE_SERVICE';
export const ORDER_SERVICE = 'ORDER_SERVICE';

export const databaseTcpHost = () => process.env.DATABASE_SERVICE_HOST ?? '127.0.0.1';
export const databaseTcpPort = () => Number(process.env.DATABASE_SERVICE_PORT ?? 5001);

export const orderServiceTcpHost = () => process.env.ORDER_SERVICE_HOST ?? '127.0.0.1';
export const orderServiceTcpPort = () => Number(process.env.ORDER_SERVICE_PORT ?? 5006);
