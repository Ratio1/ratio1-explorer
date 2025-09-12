'use client';

import { getActiveNodes } from '@/lib/api';
import { countryCountsToGeoJSON } from '@/lib/gis';
import { NodeState } from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
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

    useEffect(() => {
        (async () => {
            await fetchGeoJSONData();
        })();

        // TODO: Hide
        mapboxgl.accessToken = 'pk.eyJ1Ijoid3pyZHgxOTExIiwiYSI6ImNtZmZkZW12NDA0NHAyanM3NmJqaDJtZ2oifQ.3JBuZOd2vNrWi_CNYjGMfw';

        if (!mapContainerRef.current) return;

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
            if (!mapRef.current) return;

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

                console.log(stats);

                setStats(stats);

                const geoJSON = countryCountsToGeoJSON(stats);

                // Update cache with data and timestamp
                geoJSONCache.data = geoJSON;
                geoJSONCache.timestamp = now;

                return geoJSON;
            } finally {
                // Clear the promise so future requests can make new ones
                geoJSONCache.promise = null;
            }
        })();

        return geoJSONCache.promise;
    };

    return (
        <div className="col gap-4">
            <div className="h-[420px]" id="map" ref={mapContainerRef}></div>

            {!stats ? (
                <div className="col w-full gap-2">
                    <Skeleton className="only-lg min-h-[56px] w-full rounded-xl" />

                    {Array(10)
                        .fill(null)
                        .map((_, index) => (
                            <Skeleton className="min-h-[84px] w-full rounded-2xl" key={index} />
                        ))}
                </div>
            ) : (
                <div className="list-wrapper">
                    <div id="list" className="list">
                        <ListHeader>
                            <div className="min-w-[160px]">Location</div>
                            <div className="min-w-[100px]">Count</div>
                            <div className="min-w-[100px]">Datacenter</div>
                            <div className="min-w-[100px]">KYC/KYB</div>
                        </ListHeader>

                        {stats.map((country) => (
                            <div key={country.code} className="row w-full justify-between gap-4">
                                <div className="font-normal text-slate-600">{country.code}</div>
                                <div className="font-robotoMono font-medium">{country.count}</div>
                                <div className="font-robotoMono font-medium">{country.datacenterCount}</div>
                                <div className="font-robotoMono font-medium">
                                    {country.count - country.kybCount}/{country.kybCount}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
