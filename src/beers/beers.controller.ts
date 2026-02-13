import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BeersService } from './beers.service';
import { CreateBeerDto } from './dto/create-beer.dto';
import { presentBeer } from './presenters/beer.presenter';
import { normalizeRefreshMode } from './types/refresh-mode';

@Controller('beers')
export class BeersController {
  constructor(private readonly service: BeersService) {}

  @Post()
  async create(@Body() dto: CreateBeerDto) {
    const beer = await this.service.create(dto);
    return presentBeer({ beer, latest: null });
  }

  @Get()
  async list(@Query('refresh') refresh?: string) {
    const mode = normalizeRefreshMode(refresh);
    const rows = await this.service.list({ refreshMode: mode });
    return rows.map(presentBeer);
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @Query('refresh') refresh?: string) {
    const mode = normalizeRefreshMode(refresh);
    const row = await this.service.getOne(id, { refreshMode: mode });
    return presentBeer(row);
  }
}
