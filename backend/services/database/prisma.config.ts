import { defineConfig } from '@prisma/config';
import { config } from 'dotenv';

const isProd = process.env.NODE_ENV === 'production';
config({ path: isProd ? '.env' : '.env.development' });

export default defineConfig({
  schema: isProd ? './prisma/schema.prod.prisma' : './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
  migrations: {
    path: './prisma/migrations',
  },
});
