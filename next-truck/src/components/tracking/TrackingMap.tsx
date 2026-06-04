"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRoute } from "@/hooks";

interface Position {
  latitude: number;
  longitude: number;
  name: string;
  city: string | null;
  state: string | null;
  country: string | null;
  formatted_address: string;
  plus_code: string;
  recorded_at: number;
}

interface DeliveryData {
  id: string;
  route_id: string;
  worker_id?: string;
  truck_id?: string;
  started_at?: number;
  finished_at?: number;
}

interface TrackingMapProps {
  positions: Position[];
  deliveryData?: DeliveryData;
}

export default function TrackingMap({ positions, deliveryData }: TrackingMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Get route data for destination info
  const { data: routeData } = useRoute(deliveryData?.route_id || "", !!deliveryData?.route_id);

  useEffect(() => {
    if (!mapContainerRef.current || positions.length === 0) return;

    // Initialize map jika belum ada
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear existing layers (kecuali tile layer)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.Control) {
        map.removeLayer(layer);
      }
    });

    // Custom truck icon untuk posisi terkini
    const truckIcon = L.divIcon({
      className: "custom-marker",
      html: `
        <div style="position: relative;">
          <div style="
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 4px solid white;
            box-shadow: 0 6px 16px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
              <path d="M15 18H9"/>
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
              <circle cx="17" cy="18" r="2"/>
              <circle cx="7" cy="18" r="2"/>
            </svg>
          </div>
          <div style="
            position: absolute;
            top: -8px;
            right: -8px;
            background: #10b981;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            animation: pulse 2s infinite;
          "></div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
      popupAnchor: [0, -24],
    });

    // Format waktu untuk popup
    const formatDate = (timestamp: number) => {
      return new Date(timestamp * 1000).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    // Hanya tampilkan marker untuk posisi terkini (index 0)
    const currentPosition = positions[0];
    if (currentPosition) {
      const latLng: [number, number] = [currentPosition.latitude, currentPosition.longitude];

      const marker = L.marker(latLng, { icon: truckIcon });

      // Custom popup dengan styling modern
      const popupContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 250px;">
          <div style="
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 12px;
            margin: -15px -20px 12px -20px;
            border-radius: 8px 8px 0 0;
            font-weight: 600;
            font-size: 14px;
          ">
            🚚 Posisi Terkini
          </div>
          <div style="padding: 0;">
            <div style="margin-bottom: 10px;">
              <div style="font-weight: 600; font-size: 15px; margin-bottom: 4px; color: #1f2937;">
                ${currentPosition.name}
              </div>
              <div style="font-size: 12px; color: #6b7280; line-height: 1.4;">
                ${currentPosition.formatted_address}
              </div>
            </div>
            <div style="border-top: 1px solid #e5e7eb; padding-top: 10px; margin-top: 10px;">
              <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px; font-size: 12px;">
                <div style="color: #6b7280; font-weight: 500;">Kota:</div>
                <div style="color: #1f2937; font-weight: 600;">${currentPosition.city || '-'}</div>

                <div style="color: #6b7280; font-weight: 500;">Provinsi:</div>
                <div style="color: #1f2937; font-weight: 600;">${currentPosition.state || '-'}</div>

                <div style="color: #6b7280; font-weight: 500;">Waktu:</div>
                <div style="color: #1f2937; font-weight: 600;">${formatDate(currentPosition.recorded_at)}</div>

                <div style="color: #6b7280; font-weight: 500;">Koordinat:</div>
                <div style="color: #1f2937; font-weight: 600; font-family: monospace;">
                  ${currentPosition.latitude.toFixed(6)}, ${currentPosition.longitude.toFixed(6)}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 350,
        className: "custom-popup",
      });

      marker.addTo(map);

      // Auto open popup untuk posisi terkini
      marker.openPopup();

      // Set view to current position
      map.setView(latLng, 13);
    }

    // Add route info control if route data is available
    if (routeData) {
      const RouteInfoControl = L.Control.extend({
        onAdd: function() {
          const div = L.DomUtil.create('div', 'route-info-control');
          div.innerHTML = `
            <div style="
              background: white;
              padding: 12px 16px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.2);
              font-family: system-ui, -apple-system, sans-serif;
              min-width: 220px;
              border: 2px solid #e5e7eb;
            ">
              <div style="font-weight: 700; font-size: 14px; color: #1f2937; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 18px;">🗺️</span>
                <span>Rute Pengiriman</span>
              </div>
              <div style="background: #f0fdf4; padding: 8px; border-radius: 6px; margin-bottom: 6px; border-left: 3px solid #10b981;">
                <div style="font-size: 10px; color: #059669; font-weight: 600; margin-bottom: 2px;">🏁 TITIK AWAL</div>
                <div style="font-size: 12px; color: #1f2937; font-weight: 600;">${routeData.start_city_name}</div>
              </div>
              <div style="text-align: center; color: #9ca3af; margin: 6px 0;">
                <span style="font-size: 16px;">↓</span>
              </div>
              <div style="background: #fef2f2; padding: 8px; border-radius: 6px; border-left: 3px solid #ef4444;">
                <div style="font-size: 10px; color: #dc2626; font-weight: 600; margin-bottom: 2px;">🎯 TUJUAN AKHIR</div>
                <div style="font-size: 12px; color: #1f2937; font-weight: 600;">${routeData.end_city_name}</div>
              </div>
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                <div style="font-size: 10px; color: #6b7280; display: flex; justify-content: space-between;">
                  <span>📏 ${routeData.distance_km} km</span>
                  <span>⏱️ ${routeData.estimated_duration_hours}h</span>
                </div>
              </div>
            </div>
          `;
          return div;
        }
      });

      new RouteInfoControl({ position: 'topright' }).addTo(map);
    }

    // Cleanup function
    return () => {
      // Jangan destroy map di sini, biarkan tetap ada untuk update
    };
  }, [positions, routeData]);

  // Cleanup saat component unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          padding: 0;
          overflow: hidden;
        }
        .custom-popup .leaflet-popup-content {
          margin: 15px 20px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .custom-popup .leaflet-popup-tip {
          box-shadow: 0 3px 14px rgba(0, 0, 0, 0.1);
        }
        .leaflet-container {
          font-family: system-ui, -apple-system, sans-serif;
          z-index: 0 !important;
        }
        .leaflet-pane {
          z-index: auto !important;
        }
        .leaflet-top,
        .leaflet-bottom {
          z-index: 10 !important;
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }
      `}</style>
      <div
        ref={mapContainerRef}
        className="w-full h-[600px] rounded-lg overflow-hidden border shadow-sm relative z-0"
      />
    </>
  );
}
