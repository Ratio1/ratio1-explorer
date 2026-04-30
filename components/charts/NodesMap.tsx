'use client';

import { Alert } from '@/app/server-components/shared/Alert';
import { CardItem } from '@/app/server-components/shared/CardItem';
import { BorderedCard } from '@/app/server-components/shared/cards/BorderedCard';
import { getActiveNodesCountryStats } from '@/lib/api';
import { countryCodeToName, countryCountsToGeoJSON } from '@/lib/gis';
import { CountryNodeStats } from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import { Layer, LayerProps, Map, MapRef, Source } from 'react-map-gl/maplibre';

import { useEffect, useRef, useState } from 'react';
import { RiMap2Line } from 'react-icons/ri';
import ListHeader from '../shared/ListHeader';

// Cache for GeoJSON data with expiration
const geoJSONCache: {
    data: GeoJSON.FeatureCollection | null;
    stats: CountryNodeStats[] | null;
    timestamp: number;
    promise: Promise<{ geoJSON: GeoJSON.FeatureCollection; stats: CountryNodeStats[] }> | null;
} = {
    data: null,
    stats: null,
    timestamp: 0,
    promise: null,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const unclusteredPointLayer: LayerProps = {
    id: 'unclustered-point',
    type: 'circle',
    source: 'nodes',
    filter: ['!', ['has', 'point_count']],
    paint: {
        'circle-color': '#1b47f7',
        'circle-radius': 20,
        'circle-stroke-width': 3,
        'circle-stroke-color': '#f1f5f9',
    },
};

const unclusteredPointTextLayer: LayerProps = {
    id: 'unclustered-point-text',
    type: 'symbol',
    source: 'nodes',
    filter: ['!', ['has', 'point_count']],
    layout: {
        'text-field': ['get', 'count'],
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 14,
        'text-anchor': 'center',
        'text-offset': [0, 0],
    },
    paint: {
        'text-color': '#ffffff',
        'text-halo-color': '#000000',
        'text-halo-width': 1,
    },
};

export default function NodesMap() {
    const mapRef = useRef<MapRef>(null);

    const [stats, setStats] = useState<CountryNodeStats[]>();

    const [geoJSONData, setGeoJSONData] = useState<GeoJSON.FeatureCollection | null>(null);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchMapData();
                setStats(data.stats);
                setGeoJSONData(data.geoJSON);
            } catch (error) {
                console.error(error);
                setError(true);
            }
        })();
    }, []);

    const fetchMapData = async (): Promise<{ geoJSON: GeoJSON.FeatureCollection; stats: CountryNodeStats[] }> => {
        const now = Date.now();

        // Check if cache is valid
        if (geoJSONCache.data && geoJSONCache.stats && now - geoJSONCache.timestamp < CACHE_DURATION) {
            return { geoJSON: geoJSONCache.data, stats: geoJSONCache.stats };
        }

        // If there's already a request in progress, wait for it
        if (geoJSONCache.promise) {
            return geoJSONCache.promise;
        }

        // Create the promise and store it to prevent duplicate requests
        geoJSONCache.promise = (async () => {
            try {
                const response = await getActiveNodesCountryStats();
                const stats = response.result.countries;
                const geoJSON = countryCountsToGeoJSON(stats);

                // Update cache with data and timestamp
                geoJSONCache.data = geoJSON;
                geoJSONCache.stats = stats;
                geoJSONCache.timestamp = now;

                return { geoJSON, stats };
            } catch (error) {
                console.error('Failed to fetch GeoJSON data:', error);
                // Re-throw the error so callers can handle it appropriately
                throw error;
            } finally {
                // Clear the promise so future requests can use the cache or retry
                geoJSONCache.promise = null;
            }
        })();

        return geoJSONCache.promise;
    };

    return (
        <div className="col gap-4">
            <div className="min-h-[420px] w-full">
                <Map
                    initialViewState={{
                        latitude: 33.5,
                        longitude: 0,
                        zoom: 1.3,
                    }}
                    mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                    ref={mapRef}
                >
                    {geoJSONData && (
                        <Source id="nodes" type="geojson" data={geoJSONData} cluster={false}>
                            <Layer {...unclusteredPointLayer} />
                            <Layer {...unclusteredPointTextLayer} />
                        </Source>
                    )}
                </Map>
            </div>

            {!stats ? (
                !error ? (
                    <div className="col w-full gap-2">
                        <Skeleton className="only-lg min-h-[56px] w-full rounded-xl" />

                        {Array(10)
                            .fill(null)
                            .map((_, index) => (
                                <Skeleton className="min-h-10 w-full rounded-xl" key={index} />
                            ))}
                    </div>
                ) : (
                    <Alert
                        variant="warning"
                        icon={<RiMap2Line className="text-lg" />}
                        title="Error"
                        description="An error occured while trying to fetch the map data."
                    />
                )
            ) : (
                <div className="list-wrapper">
                    <div id="list" className="list">
                        <ListHeader>
                            <div className="min-w-[160px]">Location</div>
                            <div className="min-w-[100px]">Total Count</div>
                            <div className="min-w-[140px]">Data Center Nodes</div>
                            <div className="min-w-[100px] text-right">KYC/KYB</div>
                        </ListHeader>

                        {stats.map((country) => (
                            <Entry country={country} key={country.code} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function Entry({ country }: { country: CountryNodeStats }) {
    return (
        <BorderedCard useCustomWrapper useFixedWidthSmall roundedSmall>
            <div className="row items-start justify-between gap-3 py-2 lg:gap-6">
                <div className="w-[160px] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium lg:text-[15px]">
                    {countryCodeToName(country.code)}
                </div>

                <div className="min-w-[100px]">
                    <CardItem label="Total Count" value={country.count} />
                </div>

                <div className="min-w-[140px]">
                    <CardItem label="Data Center Nodes" value={country.datacenterCount} />
                </div>

                <div className="min-w-[100px]">
                    <CardItem
                        label="KYC/KYB"
                        value={
                            <div className="text-left lg:text-right">
                                {country.count - country.kybCount} / {country.kybCount}
                            </div>
                        }
                    />
                </div>
            </div>
        </BorderedCard>
    );
}
