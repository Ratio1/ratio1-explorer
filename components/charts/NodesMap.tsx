'use client';

import { Alert } from '@/app/server-components/shared/Alert';
import { CardItem } from '@/app/server-components/shared/CardItem';
import { BorderedCard } from '@/app/server-components/shared/cards/BorderedCard';
import { getActiveNodes } from '@/lib/api';
import { countryCodeToName, countryCountsToGeoJSON } from '@/lib/gis';
import { NodeState } from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
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

export default function NodesMap() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    const [stats, setStats] = useState<
        {
            code: string;
            count: number;
            datacenterCount: number;
            kybCount: number;
        }[]
    >();

    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                await fetchGeoJSONData();
            } catch (error) {
                console.error(error);
                setError(true);
            }
        })();

        // TODO: Hide
        mapboxgl.accessToken = 'pk.eyJ1Ijoid3pyZHgxOTExIiwiYSI6ImNtZmZkZW12NDA0NHAyanM3NmJqaDJtZ2oifQ.3JBuZOd2vNrWi_CNYjGMfw';

        if (!mapContainerRef.current) {
            return;
        }

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/wzrdx1911/cmffhv43i00ch01qwdsix84vf', // TODO: Ratio1 account
            config: {
                basemap: {
                    theme: 'faded',
                    lightPreset: 'dawn',
                },
            },
            center: [20, 36],
            zoom: 1.2,
        });

        mapRef.current.on('load', async () => {
            if (!mapRef.current) {
                return;
            }

            try {
                const data = await fetchGeoJSONData();

                mapRef.current.addSource('nodes', {
                    type: 'geojson',
                    generateId: true,
                    data,
                    cluster: false,
                });

                mapRef.current.addLayer({
                    id: 'unclustered-point',
                    type: 'circle',
                    source: 'nodes',
                    filter: ['!', ['has', 'point_count']],
                    paint: {
                        'circle-color': '#1b47f7',
                        'circle-radius': 20,
                        'circle-stroke-width': 3,
                        'circle-stroke-color': '#f1f5f9',
                        'circle-emissive-strength': 1,
                    },
                });

                // Add text layer for count values
                mapRef.current.addLayer({
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
                });
            } catch (error) {
                console.error(error);
            }
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, []);

    const fetchGeoJSONData = async (): Promise<GeoJSON.FeatureCollection> => {
        const now = Date.now();

        // Check if cache is valid
        if (geoJSONCache.data && now - geoJSONCache.timestamp < CACHE_DURATION) {
            console.log('Using cached GeoJSON data');
            return geoJSONCache.data;
        }

        // If there's already a request in progress, wait for it
        if (geoJSONCache.promise) {
            console.log('Waiting for ongoing request to complete');
            return geoJSONCache.promise;
        }

        console.log('Fetching fresh GeoJSON data');

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
            <div className="h-[420px]" id="map" ref={mapContainerRef}></div>

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
                            <div className="min-w-[100px]">Toal Count</div>
                            <div className="min-w-[140px]">Datacenter Nodes</div>
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
                    <CardItem label="Toal Count" value={country.count} />
                </div>

                <div className="min-w-[140px]">
                    <CardItem label="Datacenter Nodes" value={country.datacenterCount} />
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
