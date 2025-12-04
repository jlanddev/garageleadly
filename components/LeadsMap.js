'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function LeadsMap({ leads = [] }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [is3D, setIs3D] = useState(false);

  const geocodeAddress = async (address, city, zip) => {
    try {
      const query = `${address}, ${city}, TX ${zip}`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lng: parseFloat(data[0].lon),
          lat: parseFloat(data[0].lat)
        };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  };

  const getMarkerColor = (status) => {
    switch (status) {
      case 'new': return '#3B82F6';
      case 'called': return '#F59E0B';
      case 'scheduled': return '#10B981';
      case 'completed': return '#6B7280';
      case 'lost': return '#EF4444';
      default: return '#3B82F6';
    }
  };

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-95.3698, 29.7604], // Houston, TX
      zoom: 10,
      pitch: 0,
      bearing: 0
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    map.current.on('load', () => {
      map.current.resize();
    });
  }, []);

  const toggle3D = () => {
    if (!map.current) return;
    const newIs3D = !is3D;
    setIs3D(newIs3D);
    map.current.easeTo({
      pitch: newIs3D ? 60 : 0,
      duration: 1000
    });
  };

  useEffect(() => {
    if (!map.current) return;

    const loadLeads = async () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];

      for (const lead of leads) {
        let coords = null;
        if (!lead.latitude || !lead.longitude) {
          coords = await geocodeAddress(lead.address, lead.city || 'Houston', lead.zip);
        } else {
          coords = { lng: lead.longitude, lat: lead.latitude };
        }

        if (!coords) continue;

        const el = document.createElement('div');
        el.innerHTML = `
          <div style="
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
          ">
            <div style="
              background: ${getMarkerColor(lead.status)};
              width: 14px;
              height: 14px;
              border-radius: 50%;
              border: 3px solid rgba(255,255,255,0.95);
              box-shadow: 0 4px 12px rgba(0,0,0,0.4);
              ${lead.status === 'new' ? 'animation: pulse 2s infinite;' : ''}
            "></div>
            <div style="
              background: rgba(0, 0, 0, 0.85);
              color: white;
              padding: 4px 10px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 600;
              margin-top: 6px;
              white-space: nowrap;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">${lead.name}</div>
          </div>
        `;

        const marker = new mapboxgl.Marker(el)
          .setLngLat([coords.lng, coords.lat])
          .addTo(map.current);

        el.addEventListener('click', () => setSelectedLead(lead));
        markers.current.push(marker);
      }

      // Fit bounds to show all markers
      if (markers.current.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        markers.current.forEach(marker => bounds.extend(marker.getLngLat()));
        map.current.fitBounds(bounds, { padding: 50, maxZoom: 12 });
      }
    };

    loadLeads();
  }, [leads]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />

      <button
        onClick={toggle3D}
        className={`absolute top-4 left-4 z-10 px-4 py-2 rounded-lg font-semibold shadow-lg transition-all ${
          is3D
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-white/95 text-gray-700 hover:bg-white border border-gray-300'
        }`}
      >
        {is3D ? '2D View' : '3D View'}
      </button>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>

      {selectedLead && (
        <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl p-5 max-w-sm z-10 border border-gray-200">
          <button
            onClick={() => setSelectedLead(null)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getMarkerColor(selectedLead.status) }}
              />
              <span className="font-bold text-lg text-gray-900">{selectedLead.name}</span>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {selectedLead.phone}
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {selectedLead.address}
              </div>
            </div>

            <div className="text-sm bg-gray-50 rounded-lg p-3">
              <div className="font-semibold text-gray-900 mb-1">Issue</div>
              <div className="text-gray-700">{selectedLead.issue_description}</div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                selectedLead.status === 'new' ? 'bg-blue-500 text-white' :
                selectedLead.status === 'scheduled' ? 'bg-green-500 text-white' :
                selectedLead.status === 'called' ? 'bg-yellow-500 text-white' :
                'bg-gray-500 text-white'
              }`}>
                {selectedLead.status.toUpperCase()}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(selectedLead.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
