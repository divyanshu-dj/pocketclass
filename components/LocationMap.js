import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.mapbox_key;



export default function LocationMap({ onLocationSelect }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40],
      zoom: 9
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: true
    });

    map.current.addControl(geocoder);

    geocoder.on('result', (e) => {
      const { result } = e;
      onLocationSelect({
        address: result.place_name,
        longitude: result.center[0],
        latitude: result.center[1]
      });
    });

    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`)
        .then(response => response.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            onLocationSelect({
              address: data.features[0].place_name,
              longitude: lng,
              latitude: lat
            });
          }
        });
    });
  }, [onLocationSelect]);

  return (
    <div ref={mapContainer} style={{ height: '400px', width: '100%', borderRadius: '12px' }} />
  );
}
