import { Module } from '@nestjs/common';
import { CardsRenderService } from './cards-render.service';
import { CardsRenderController } from './cards-render.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseClientProvider } from '../interfaces/database-client.provider';

/**
 * Cards Render Module
 * SOLID Principle: Dependency Inversion
 * Provides dependencies through interfaces
 */
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
  ],
  controllers: [CardsRenderController],
  providers: [CardsRenderService, DatabaseClientProvider],
  exports: [CardsRenderService],
})
export class CardsRenderModule {}
