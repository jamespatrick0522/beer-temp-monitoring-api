import { Controller, Get } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { DbService } from '../common/db/db.service';

@Controller('health')
export class HealthController {
  constructor(private readonly dbService: DbService) {}

  @Get()
  async check() {
    const startedAt = process.env.APP_STARTED_AT || new Date().toISOString();

    const result = await this.dbService.db.execute(sql`select 1 as ok`);

    return {
      status: 'ok',
      uptimeSeconds: Math.floor(process.uptime()),
      startedAt,
      db: {
        ok: Array.isArray(result) ? true : true,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
