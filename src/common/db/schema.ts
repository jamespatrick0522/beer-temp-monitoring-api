import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  index,
  numeric,
} from 'drizzle-orm/pg-core';

export const beers = pgTable('beers', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: varchar('name', { length: 120 }).notNull().unique(),

  minTempC: numeric('min_temp_c', {
    precision: 4,
    scale: 1,
    mode: 'number',
  }).notNull(),
  maxTempC: numeric('max_temp_c', {
    precision: 4,
    scale: 1,
    mode: 'number',
  }).notNull(),

  imageUrl: varchar('image_url', { length: 512 }),

  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const temperatureReadings = pgTable(
  'temperature_readings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    beerId: uuid('beer_id')
      .notNull()
      .references(() => beers.id, { onDelete: 'restrict' }),

    temperatureC: numeric('temperature_c', {
      precision: 4,
      scale: 1,
      mode: 'number',
    }).notNull(),
    recordedAt: timestamp('recorded_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    beerRecordedIdx: index('temperature_readings_beer_recorded_idx').on(
      t.beerId,
      t.recordedAt,
    ),
  }),
);
