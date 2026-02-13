# Brewery Container Monitor API (NestJS + PostgreSQL + Drizzle)

## Highlights

- Modular NestJS structure (beers module)
- Drizzle ORM with SQL-explicit queries
- Efficient "latest reading per beer" query using Postgres DISTINCT ON
- Polling-safe temperature generation (prevents write amplification with multiple clients)

## Running locally

1. `cp .env.example .env`
2. `docker compose up -d`
3. `npm i`
4. `npm run db:generate`
5. `npm run db:migrate`
6. `npm run start:dev`

## Endpoints

- POST `/beers`
- GET `/beers?refresh=true|false`
- GET `/beers/:id?refresh=true|false`

## Behavior notes (real-time + multiple clients)

Frontend can poll `GET /beers` every few seconds.
To avoid creating too many history rows if multiple clients poll simultaneously, the API only writes a new temperature reading if the last one is older than 5 seconds.

## Assumptions / questions (with answers)

- Polling is the first version of “real-time” (web + mobile friendly).
- Temperature readings are mocked (random 0–7°C), but stored for history.
- History retrieval is out of scope, but schema supports adding it later.

## Next improvements

- Concurrency hardening: ensure one reading per beer per interval (DB advisory lock or unique bucket key).
- Batch refresh in a single transaction (avoid per-beer round trips).
- Add tests for refresh behavior and range flagging.
- Add caching headers / ETags for mobile efficiency.
- Add structured logging and request IDs.
