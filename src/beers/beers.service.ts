import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBeerDto } from './dto/create-beer.dto';
import { BeersRepository } from './beers.repository';
import type { RefreshMode } from './types/refresh-mode';

@Injectable()
export class BeersService {
  private readonly MIN_REFRESH_INTERVAL_MS = 5000;

  constructor(private readonly repo: BeersRepository) {}

  async create(dto: CreateBeerDto) {
    if (dto.minTempC > dto.maxTempC) {
      throw new BadRequestException('minTempC must be <= maxTempC');
    }

    return this.repo.createBeer({
      name: dto.name.trim(),
      minTempC: dto.minTempC,
      maxTempC: dto.maxTempC,
      imageUrl: dto.imageUrl ?? null,
    });
  }

  async list(options?: { refreshMode?: RefreshMode }) {
    const refreshMode = options?.refreshMode ?? 'always';

    const rows = await this.repo.listBeersWithLatestReading();

    if (refreshMode !== 'false') {
      for (const row of rows) {
        await this.refreshReading(
          row.beer.id,
          row.latest?.recordedAt ?? null,
          refreshMode,
        );
      }
      return this.repo.listBeersWithLatestReading();
    }

    return rows;
  }

  async getOne(id: string, options?: { refreshMode?: RefreshMode }) {
    const refreshMode = options?.refreshMode ?? 'always';

    const beer = await this.repo.findBeerById(id);
    if (!beer) throw new NotFoundException('Beer not found');

    const latest = await this.repo.getLatestReadingForBeer(id);

    if (refreshMode !== 'false') {
      await this.refreshReading(id, latest?.recordedAt ?? null, refreshMode);
    }

    const latest2 = await this.repo.getLatestReadingForBeer(id);
    return { beer, latest: latest2 };
  }

  private async refreshReading(
    beerId: string,
    lastRecordedAt: Date | null,
    mode: RefreshMode,
  ) {
    if (mode === 'throttle' && lastRecordedAt) {
      const ageMs = Date.now() - lastRecordedAt.getTime();
      if (ageMs < this.MIN_REFRESH_INTERVAL_MS) return;
    }

    const temperatureC = this.randomTemp0to7_1dp();
    await this.repo.insertReading(beerId, temperatureC);
  }

  private randomTemp0to7_1dp() {
    return Number((Math.random() * 7).toFixed(1));
  }
}
