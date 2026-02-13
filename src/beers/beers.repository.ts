import { Injectable } from '@nestjs/common';
import { and, desc, eq, sql } from 'drizzle-orm';
import { DbService } from '../common/db/db.service';
import { beers, temperatureReadings } from '../common/db/schema';

@Injectable()
export class BeersRepository {
  constructor(private readonly dbService: DbService) {}

  db() {
    return this.dbService.db;
  }

  async createBeer(data: {
    name: string;
    minTempC: number;
    maxTempC: number;
    imageUrl?: string | null;
  }) {
    const [created] = await this.db()
      .insert(beers)
      .values({
        name: data.name,
        minTempC: data.minTempC,
        maxTempC: data.maxTempC,
        imageUrl: data.imageUrl ?? null,
      })
      .returning();

    return created;
  }

  async findBeerById(id: string) {
    const [row] = await this.db()
      .select()
      .from(beers)
      .where(eq(beers.id, id))
      .limit(1);
    return row ?? null;
  }

  async listBeersWithLatestReading() {
    const latest = this.db()
      .selectDistinctOn([temperatureReadings.beerId], {
        beerId: temperatureReadings.beerId,
        temperatureC: temperatureReadings.temperatureC,
        recordedAt: temperatureReadings.recordedAt,
      })
      .from(temperatureReadings)
      .orderBy(temperatureReadings.beerId, desc(temperatureReadings.recordedAt))
      .as('latest');

    const rows = await this.db()
      .select({
        beer: beers,
        latest: {
          temperatureC: latest.temperatureC,
          recordedAt: latest.recordedAt,
        },
      })
      .from(beers)
      .leftJoin(latest, eq(latest.beerId, beers.id))
      .orderBy(beers.createdAt);

    return rows.map((r) => ({
      beer: {
        ...r.beer,
        imageUrl: r.beer.imageUrl ?? null,
      },
      latest: r.latest?.recordedAt
        ? {
            temperatureC: r.latest.temperatureC,
            recordedAt: r.latest.recordedAt,
          }
        : null,
    }));
  }

  async getLatestReadingForBeer(beerId: string) {
    const [row] = await this.db()
      .select({
        temperatureC: temperatureReadings.temperatureC,
        recordedAt: temperatureReadings.recordedAt,
      })
      .from(temperatureReadings)
      .where(eq(temperatureReadings.beerId, beerId))
      .orderBy(desc(temperatureReadings.recordedAt))
      .limit(1);

    return row ?? null;
  }

  async insertReading(beerId: string, temperatureC: number) {
    const [row] = await this.db()
      .insert(temperatureReadings)
      .values({ beerId, temperatureC })
      .returning({
        temperatureC: temperatureReadings.temperatureC,
        recordedAt: temperatureReadings.recordedAt,
      });

    return row;
  }
}
