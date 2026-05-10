import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

type SwaggerOptions = {
  serviceName: string;
  serviceDescription: string;
  version?: string;
  path?: string;
  bearerAuth?: boolean;
};

export function isDevSwaggerEnabled(): boolean {
  return process.env.NODE_ENV !== 'production';
}

export function setupSwagger(app: INestApplication, options: SwaggerOptions): string | null {
  if (!isDevSwaggerEnabled()) {
    return null;
  }

  const path = options.path ?? 'docs';
  const builder = new DocumentBuilder()
    .setTitle(`${options.serviceName} API`)
    .setDescription(options.serviceDescription)
    .setVersion(options.version ?? '1.0.0');

  if (options.bearerAuth) {
    builder.addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Paste JWT access token',
      },
      'bearer',
    );
  }

  const document = SwaggerModule.createDocument(app, builder.build());
  SwaggerModule.setup(path, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  return path;
}
