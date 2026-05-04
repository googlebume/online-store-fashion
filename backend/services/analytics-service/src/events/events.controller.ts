import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { EventsService, type IngestEventDto } from './events.service';

type IngestBody =
  | IngestEventDto
  | {
      events: IngestEventDto[];
    };

@Controller('fashion/analytics')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('events')
  async ingest(@Body() body: IngestBody) {
    const events = Array.isArray((body as { events?: IngestEventDto[] }).events)
      ? (body as { events: IngestEventDto[] }).events
      : body && typeof (body as IngestEventDto).name === 'string'
        ? [body as IngestEventDto]
        : [];

    if (!events.length) {
      throw new HttpException(
        'Provide a single event object with `name` or an `events` array',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.eventsService.ingest(events);
    return {
      success: result.errors.length === 0 || result.stored > 0,
      stored: result.stored,
      errors: result.errors,
    };
  }
}
