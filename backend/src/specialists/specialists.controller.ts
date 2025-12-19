import { Controller, Get, Query } from '@nestjs/common';
import { GetSpecialistsQueryDto } from './dto/get-specialists.dto';
import { SpecialistsService } from './specialists.service';
import type { Specialist } from './specialist.entity';

interface SpecialistListResponse {
  items: Specialist[];
  total: number;
  hasMore: boolean;
}

@Controller('specialists')
export class SpecialistsController {
  constructor(private readonly specialistsService: SpecialistsService) {}

  @Get()
  getSpecialists(@Query() query: GetSpecialistsQueryDto): Promise<SpecialistListResponse> {
    return this.specialistsService.listSpecialists(query);
  }
}

