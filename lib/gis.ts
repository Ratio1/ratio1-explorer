import countries from 'world-countries';

// "DE" -> { lon, lat }
const ISO2_TO_LL = new Map(countries.map((c) => [c.cca2, { lat: c.latlng[0], lon: c.latlng[1] }]));

const ISO2_TO_NAME = new Map(countries.map((c) => [c.cca2, c.name.common]));

export function countryCodeToLngLat(iso2: string): [number, number] | null {
    const entry = ISO2_TO_LL.get(iso2.toUpperCase());
    return entry ? [entry.lon, entry.lat] : null; // MapLibre/Mapbox expect [lng, lat]
}

type CountryNodeCount = { code: string; count: number };

export function countryCountsToGeoJSON(list: CountryNodeCount[]) {
    return {
        type: 'FeatureCollection',
        features: list
            .map(({ code, count }) => {
                const ll = countryCodeToLngLat(code);
                if (!ll) return null;
                return {
                    type: 'Feature',
                    properties: { code, count },
                    geometry: { type: 'Point', coordinates: ll },
                };
            })
            .filter(Boolean),
    } as GeoJSON.FeatureCollection;
}

export function countryCodeToName(iso2: string): string | null {
    return ISO2_TO_NAME.get(iso2.toUpperCase()) ?? null;
}
