import { Module } from '@nestjs/common';
import { BeersService } from './beers.service';
import { BeersController } from './beers.controller';
import { BeersRepository } from './beers.repository';

@Module({
  providers: [BeersService, BeersRepository],
  controllers: [BeersController],
})
export class BeersModule {}
