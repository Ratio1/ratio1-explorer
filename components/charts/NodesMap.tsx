'use client';

import { Alert } from '@/app/server-components/shared/Alert';
import { CardItem } from '@/app/server-components/shared/CardItem';
import { BorderedCard } from '@/app/server-components/shared/cards/BorderedCard';
import { getActiveNodes } from '@/lib/api';
import { countryCodeToName, countryCountsToGeoJSON } from '@/lib/gis';
import { NodeState } from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import { Layer, LayerProps, Map, MapRef, Source } from 'react-map-gl/maplibre';

import { useEffect, useRef, useState } from 'react';
import { RiMap2Line } from 'react-icons/ri';
import ListHeader from '../shared/ListHeader';

// Cache for GeoJSON data with expiration
const geoJSONCache: {
    data: GeoJSON.FeatureCollection | null;
    timestamp: number;
    promise: Promise<GeoJSON.FeatureCollection> | null;
} = {
    data: null,
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

    const [stats, setStats] = useState<
        {
            code: string;
            count: number;
            datacenterCount: number;
            kybCount: number;
        }[]
    >();

    const [geoJSONData, setGeoJSONData] = useState<GeoJSON.FeatureCollection | null>(null);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchGeoJSONData();
                setGeoJSONData(data);
            } catch (error) {
                console.error(error);
                setError(true);
            }
        })();
    }, []);

    const fetchGeoJSONData = async (): Promise<GeoJSON.FeatureCollection> => {
        const now = Date.now();

        // Check if cache is valid
        if (geoJSONCache.data && now - geoJSONCache.timestamp < CACHE_DURATION) {
            return geoJSONCache.data;
        }

        // If there's already a request in progress, wait for it
        if (geoJSONCache.promise) {
            return geoJSONCache.promise;
        }

        // Create the promise and store it to prevent duplicate requests
        geoJSONCache.promise = (async () => {
            try {
                const response = await getActiveNodes(1, 1_000_000);

                const group: Record<string, NodeState[]> = Object.values(response.result.nodes).reduce(
                    (groups, node) => {
                        const countryTag = node.tags?.find((tag) => tag.includes('CT:'));

                        if (countryTag) {
                            const countryCode = countryTag.slice(3);

                            if (!groups[countryCode]) {
                                groups[countryCode] = [];
                            }

                            groups[countryCode].push(node);
                        }

                        return groups;
                    },
                    {} as Record<string, (typeof response.result.nodes)[string][]>,
                );

                const stats = Object.entries(group).map(([code, nodes]) => ({
                    code,
                    count: nodes.length,
                    datacenterCount: nodes.filter((node) => node.tags?.some((tag) => tag.includes('DC:'))).length,
                    kybCount: nodes.filter((node) => node.tags?.some((tag) => tag.includes('KYB'))).length,
                }));

                console.log(stats.sort((a, b) => b.count - a.count));
                setStats(stats.sort((a, b) => b.count - a.count));

                const geoJSON = countryCountsToGeoJSON(stats);

                // Update cache with data and timestamp
                geoJSONCache.data = geoJSON;
                geoJSONCache.timestamp = now;

                return geoJSON;
            } catch (error) {
                console.error('Failed to fetch GeoJSON data:', error);
                // Clear the promise so future requests can retry
                geoJSONCache.promise = null;
                // Re-throw the error so callers can handle it appropriately
                throw error;
            }
        })();

        return geoJSONCache.promise;
    };

    return (
        <div className="col gap-4">
            <div className="min-h-[420px] w-full">
                <Map
                    initialViewState={{
                        latitude: 10,
                        longitude: 36,
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

function Entry({ country }: { country: { code: string; count: number; datacenterCount: number; kybCount: number } }) {
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
