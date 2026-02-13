export function presentBeer(row: {
  beer: {
    id: string;
    name: string;
    minTempC: number;
    maxTempC: number;
    imageUrl: string | null;
  };
  latest: { temperatureC: number; recordedAt: Date } | null;
}) {
  const { beer, latest } = row;

  const currentTemp = latest ? latest.temperatureC : null;
  const inRange =
    currentTemp === null
      ? null
      : currentTemp >= beer.minTempC && currentTemp <= beer.maxTempC;

  return {
    id: beer.id,
    name: beer.name,
    range: { minTempC: beer.minTempC, maxTempC: beer.maxTempC },
    imageUrl: beer.imageUrl,
    current: latest
      ? {
          temperatureC: currentTemp,
          recordedAt: latest.recordedAt.toISOString(),
          inRange,
        }
      : {
          temperatureC: null,
          recordedAt: null,
          inRange: null,
        },
  };
}
