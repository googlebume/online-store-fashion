import { Module } from '@nestjs/common';
import { CardsRenderService } from './cards-render.service';
import { CardsRenderController } from './cards-render.controller';
import { ThrottlerModule } from '@nestjs/throttler';

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
  controllers: [CardsRenderController,],
  providers: [CardsRenderService],
})
export class CardsRenderModule {}
