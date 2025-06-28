"use client";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.mapbox_key;

export default function LocationMap({ locations = [] }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Safe cleanup function
    const cleanup = () => {
      try {
        // Remove all markers
        markersRef.current.forEach(marker => {
          try {
            marker?.remove?.();
          } catch (e) {
            console.warn("Marker cleanup error:", e);
          }
        });
        markersRef.current = [];

        // Remove map instance if it exists
        if (mapInstanceRef.current) {
          try {
            // Check if map instance is still valid
            if (mapInstanceRef.current.getContainer()) {
              mapInstanceRef.current.remove();
            }
          } catch (e) {
            console.warn("Map cleanup error:", e);
          }
          mapInstanceRef.current = null;
        }
      } catch (e) {
        console.error("Cleanup failed:", e);
      }
    };

    cleanup();

    const validLocations = locations.filter(loc => {
      const lat = Number(loc.lat);
      const lng = Number(loc.lng);
      return !isNaN(lat) && !isNaN(lng);
    });

    if (validLocations.length === 0) return;

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [validLocations[0].lng, validLocations[0].lat],
        zoom: 12,
      });

      mapInstanceRef.current = map;

      map.on('load', () => {
        const bounds = new mapboxgl.LngLatBounds();

        validLocations.forEach((loc) => {
          const coords = [loc.lng, loc.lat];
          
          const el = document.createElement('div');
          el.className = 'map-marker';
          el.style.width = '20px';
          el.style.height = '20px';
          el.style.backgroundColor = '#3FB1CE';
          el.style.borderRadius = '50%';
          el.style.border = '2px solid white';

          const marker = new mapboxgl.Marker(el)
            .setLngLat(coords)
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div class="p-2">
                <h3 class="font-bold">${loc.name || 'Location'}</h3>
                ${loc.address ? `<p class="text-sm">${loc.address}</p>` : ''}
              </div>`
            ))
            .addTo(map);

          markersRef.current.push(marker);
          bounds.extend(coords);
        });

        if (validLocations.length > 1) {
          map.fitBounds(bounds, {
            padding: 50,
            maxZoom: 12,
            duration: 1000
          });
        } else {
          map.setZoom(14);
        }
      });

      // Handle map error events
      map.on('error', (e) => {
        console.error('Map error:', e.error);
      });

    } catch (e) {
      console.error('Map initialization failed:', e);
    }

    return cleanup;
  }, [locations]);

  return (
    <div className="w-full h-[400px] rounded-lg shadow-md overflow-hidden relative">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}