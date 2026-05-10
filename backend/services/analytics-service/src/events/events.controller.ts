import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EventsService, type IngestEventDto } from './events.service';
import { analyticsIngestSchema } from '@packages/shared/common/swagger/response-schemas';

type IngestBody =
  | IngestEventDto
  | {
      events: IngestEventDto[];
    };

@ApiTags('Analytics Events')
@Controller('fashion/analytics')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('events')
  @ApiOperation({ summary: 'Store one or many analytics events' })
  @ApiBody({
    schema: {
      oneOf: [
        {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'page_view' },
            sessionId: { type: 'string', example: 'session-123' },
            userId: { type: 'string', example: 'fa2ab114-bf38-43d0-b0dc-4fe6cd34f001' },
            productId: { type: 'string', example: '9f5051b7-5f5d-4f6e-9f35-2f3d9aa4f001' },
            path: { type: 'string', example: '/shop/hoodie_1' },
            durationMs: { type: 'number', example: 1450 },
            payload: { type: 'object', additionalProperties: true },
            clientId: { type: 'string', example: 'ga-client-id' },
          },
        },
        {
          type: 'object',
          required: ['events'],
          properties: {
            events: {
              type: 'array',
              items: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'add_to_cart' },
                  sessionId: { type: 'string', example: 'session-123' },
                  userId: { type: 'string', example: 'fa2ab114-bf38-43d0-b0dc-4fe6cd34f001' },
                  productId: { type: 'string', example: '9f5051b7-5f5d-4f6e-9f35-2f3d9aa4f001' },
                  path: { type: 'string', example: '/shop/hoodie_1' },
                  durationMs: { type: 'number', example: 1450 },
                  payload: { type: 'object', additionalProperties: true },
                  clientId: { type: 'string', example: 'ga-client-id' },
                },
              },
            },
          },
        },
      ],
    },
  })
  @ApiOkResponse({ description: 'Analytics ingestion result', schema: analyticsIngestSchema })
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
