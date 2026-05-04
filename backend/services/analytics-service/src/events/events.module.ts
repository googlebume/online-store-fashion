import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Ga4Service } from '../ga4/ga4.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService, Ga4Service],
})
export class EventsModule {}
