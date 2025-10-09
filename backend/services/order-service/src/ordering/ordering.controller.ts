import { Controller } from '@nestjs/common';
import { OrderingService } from './ordering.service';

@Controller('ordering')
export class OrderingController {
  constructor(private readonly orderingService: OrderingService) {}
}
