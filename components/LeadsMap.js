'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox token from environment variable
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function LeadsMap({ leads = [] }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [selectedLead, setSelectedLead] = useState(null);

  // Geocode address using Nominatim (free, no API key needed)
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

  // Get marker color based on lead status
  const getMarkerColor = (status) => {
    switch (status) {
      case 'new':
        return '#3B82F6'; // Bright blue
      case 'called':
        return '#F59E0B'; // Orange/yellow
      case 'scheduled':
        return '#10B981'; // Bright green
      case 'completed':
        return '#6B7280'; // Gray
      case 'lost':
        return '#EF4444'; // Red
      default:
        return '#3B82F6';
    }
  };

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-95.3698, 29.7604], // Houston, TX
      zoom: 9,
      pitch: 0
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
  }, []);

  // Update markers when leads change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for each lead
    leads.forEach(async (lead) => {
      // Try to get coordinates
      let coords = null;

      // If lead doesn't have coordinates, geocode it
      if (!lead.latitude || !lead.longitude) {
        coords = await geocodeAddress(lead.address, lead.city || 'Houston', lead.zip);
      } else {
        coords = { lng: lead.longitude, lat: lead.latitude };
      }

      if (!coords) return;

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = getMarkerColor(lead.status);
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';

      // Add pulsing animation for new leads
      if (lead.status === 'new') {
        el.style.animation = 'pulse 2s infinite';
      }

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([coords.lng, coords.lat])
        .addTo(map.current);

      // Add click event
      el.addEventListener('click', () => {
        setSelectedLead(lead);
      });

      markers.current.push(marker);
    });
  }, [leads]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />

      {/* Add pulsing animation CSS */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 20px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
      `}</style>

      {/* Lead details popup */}
      {selectedLead && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-2xl p-4 max-w-sm z-10">
          <button
            onClick={() => setSelectedLead(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getMarkerColor(selectedLead.status) }}
              />
              <span className="font-bold text-lg">{selectedLead.name}</span>
            </div>

            <div className="text-sm text-gray-600">
              <div>📞 {selectedLead.phone}</div>
              <div>📍 {selectedLead.address}</div>
              <div>🏘️ {selectedLead.city}, {selectedLead.zip}</div>
            </div>

            <div className="text-sm">
              <span className="font-semibold">Issue:</span> {selectedLead.issue_description}
            </div>

            <div className="pt-2 border-t">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                selectedLead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                selectedLead.status === 'scheduled' ? 'bg-green-100 text-green-700' :
                selectedLead.status === 'called' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {selectedLead.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <div className="text-xs font-semibold mb-2">Lead Status</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>New</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span>Called</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span>Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
