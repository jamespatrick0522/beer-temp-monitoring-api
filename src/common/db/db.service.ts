import { Injectable } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export type Db = NodePgDatabase<typeof schema>;

@Injectable()
export class DbService {
  private readonly pool: Pool;
  public readonly db: Db;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
    });

    this.db = drizzle(this.pool, { schema });
  }
}
