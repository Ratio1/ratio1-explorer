'use client';

import { getActiveNodes } from '@/lib/api';
import { countryCountsToGeoJSON } from '@/lib/gis';
import { NodeState } from '@/typedefs/blockchain';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from 'react';

export default function NodesMap() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1Ijoid3pyZHgxOTExIiwiYSI6ImNtZmZkZW12NDA0NHAyanM3NmJqaDJtZ2oifQ.3JBuZOd2vNrWi_CNYjGMfw';

        if (!mapContainerRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            // style: 'mapbox://styles/mapbox/light-v11',
            style: 'mapbox://styles/wzrdx1911/cmffhv43i00ch01qwdsix84vf',
            config: {
                basemap: {
                    theme: 'faded',
                    lightPreset: 'day',
                },
            },
            center: [24, 54],
            zoom: 3,
        });

        mapRef.current.on('load', async () => {
            if (!mapRef.current) return;

            const data = await fetchGeoJSONData();

            mapRef.current.addSource('nodes', {
                type: 'geojson',
                generateId: true,
                data,
                cluster: false,
                // clusterMaxZoom: 14,
                // clusterRadius: 50,
            });

            // mapRef.current.addLayer({
            //     id: 'clusters',
            //     type: 'circle',
            //     source: 'nodes',
            //     filter: ['has', 'point_count'],
            //     paint: {
            //         'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
            //         'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
            //         'circle-emissive-strength': 1,
            //     },
            // });

            // mapRef.current.addLayer({
            //     id: 'cluster-count',
            //     type: 'symbol',
            //     source: 'nodes',
            //     filter: ['has', 'point_count'],
            //     layout: {
            //         'text-field': ['get', 'point_count_abbreviated'],
            //         'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            //         'text-size': 12,
            //     },
            // });

            mapRef.current.addLayer({
                id: 'unclustered-point',
                type: 'circle',
                source: 'nodes',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': '#1b47f7',
                    'circle-radius': 10,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#fff',
                    'circle-emissive-strength': 1,
                },
            });

            // inspect a cluster on click
            // mapRef.current.addInteraction('click-clusters', {
            //     type: 'click',
            //     target: { layerId: 'clusters' },
            //     handler: (e) => {
            //         if (!mapRef.current) return;

            //         const features = mapRef.current.queryRenderedFeatures(e.point, {
            //             layers: ['clusters'],
            //         });
            //         if (features.length === 0) return;

            //         const clusterId = features[0].properties?.cluster_id;
            //         if (!clusterId) return;

            //         const source = mapRef.current.getSource('nodes') as mapboxgl.GeoJSONSource;
            //         source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            //             if (err || !mapRef.current || !zoom) return;

            //             const geometry = features[0].geometry as mapboxgl.GeoJSONFeature['geometry'];
            //             if (geometry.type === 'Point') {
            //                 mapRef.current.easeTo({
            //                     center: geometry.coordinates as [number, number],
            //                     zoom: zoom,
            //                 });
            //             }
            //         });
            //     },
            // });

            // When a click event occurs on a feature in
            // the unclustered-point layer, open a popup at
            // the location of the feature, with
            // description HTML from its properties.
            mapRef.current.addInteraction('click-unclustered', {
                type: 'click',
                target: { layerId: 'unclustered-point' },
                handler: (e) => {
                    if (!mapRef.current || !e.feature) return;

                    const geometry = e.feature.geometry as mapboxgl.GeoJSONFeature['geometry'];
                    if (geometry.type !== 'Point') return;

                    const coordinates = geometry.coordinates.slice() as [number, number];

                    new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(`${e.feature.properties.count} nodes`)
                        .addTo(mapRef.current);
                },
            });

            // Change the cursor to a pointer when the mouse is over a cluster of POIs.
            // mapRef.current.addInteraction('clustered-mouseenter', {
            //     type: 'mouseenter',
            //     target: { layerId: 'clusters' },
            //     handler: () => {
            //         if (!mapRef.current) return;
            //         mapRef.current.getCanvas().style.cursor = 'pointer';
            //     },
            // });

            // // Change the cursor back to a pointer when it stops hovering over a cluster of POIs.
            // mapRef.current.addInteraction('clustered-mouseleave', {
            //     type: 'mouseleave',
            //     target: { layerId: 'clusters' },
            //     handler: () => {
            //         if (!mapRef.current) return;
            //         mapRef.current.getCanvas().style.cursor = '';
            //     },
            // });

            // Change the cursor to a pointer when the mouse is over an individual POI.
            mapRef.current.addInteraction('unclustered-mouseenter', {
                type: 'mouseenter',
                target: { layerId: 'unclustered-point' },
                handler: () => {
                    if (!mapRef.current) return;
                    mapRef.current.getCanvas().style.cursor = 'pointer';
                },
            });

            // Change the cursor back to a pointer when it stops hovering over an individual POI.
            mapRef.current.addInteraction('unclustered-mouseleave', {
                type: 'mouseleave',
                target: { layerId: 'unclustered-point' },
                handler: () => {
                    if (!mapRef.current) return;
                    mapRef.current.getCanvas().style.cursor = '';
                },
            });
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, []);

    const fetchGeoJSONData = async () => {
        const response = await getActiveNodes(1, 999);

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

        const countryNodeCounts = Object.entries(group).map(([code, nodes]) => ({
            code,
            count: nodes.length,
        }));

        const geoJSON = countryCountsToGeoJSON(countryNodeCounts);

        console.log({ countryNodeCounts, geoJSON });

        return geoJSON;
    };

    return <div className="h-[500px]" id="map" ref={mapContainerRef}></div>;
}
