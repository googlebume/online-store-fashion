import { Controller, Post, Body } from '@nestjs/common';
import { FiltersHandlerService } from './filters-handler.service';

@Controller('filters-handler')
export class FiltersHandlerController {
  constructor(private readonly filtersHandlerService: FiltersHandlerService) {}

  @Post('')
  handleFilters(@Body() filters: { [key: string]: string }) {
    const filteredProducts = this.filtersHandlerService.filterCategorys(filters);
    return { filteredProducts };
  }
}
