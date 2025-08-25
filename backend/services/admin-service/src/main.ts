import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

// import { JwtAuthGuard } from '@packages/shared/src/common/guards/jwt-auth.guard'
// import { RolesGuard } from '@packages/shared/src/common/guards/roles.guard'
// import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST, PUT, DELETE',
    allowedHeaders: 'Content-Type,Authorization'
  })
  
  await app.listen(process.env.PORT ?? 4005 );
}
bootstrap();
