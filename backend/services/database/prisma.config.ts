import { defineConfig } from '@prisma/config';
import { config } from 'dotenv';

config({ path: '.env.development' });

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
  migrations: {
    path: './prisma/migrations',
  },
});
