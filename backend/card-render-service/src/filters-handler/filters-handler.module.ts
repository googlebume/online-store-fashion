import { Module } from '@nestjs/common';
import { FiltersHandlerService } from './filters-handler.service';
import { FiltersHandlerController } from './filters-handler.controller';

@Module({
  controllers: [FiltersHandlerController],
  providers: [FiltersHandlerService],
})
export class FiltersHandlerModule {}
