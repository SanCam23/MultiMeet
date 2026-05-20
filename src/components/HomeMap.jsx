"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { X } from "lucide-react";
import Link from "next/link";
import { useFocusTrap } from "@/hooks/useFocusTrap";

// Custom hook to fit all markers in view
function FitBounds({ events }) {
  const map = useMap();

  useEffect(() => {
    if (events && events.length > 0) {
      const validEvents = events.filter(e => e.lat && e.lng);
      if (validEvents.length > 0) {
        const bounds = L.latLngBounds(validEvents.map(e => [e.lat, e.lng]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [events, map]);

  return null;
}

export default function HomeMap({ events, onClose }) {
  // Filter events that have valid coordinates
  const mapEvents = events.filter(e => e.lat != null && e.lng != null);
  const trapRef = useFocusTrap(true, onClose);

  // Default center (Spain roughly, or Madrid) if no events
  const defaultCenter = [40.4168, -3.7038];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 md:p-8 pb-[10vh]">
      <div 
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="map-dialog-title"
        className="bg-card w-full h-[80dvh] md:h-[90vh] max-h-[800px] max-w-6xl rounded-xl md:rounded-2xl overflow-hidden shadow-2xl relative flex flex-col border border-border"
      >
        <div className="flex items-center justify-between p-4 bg-background border-b border-border">
          <h2 id="map-dialog-title" className="text-xl font-bold text-primary">Mapa de Eventos</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Cerrar mapa"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 w-full h-full relative">
          <MapContainer
            center={defaultCenter}
            zoom={6}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {mapEvents.map((event) => {
              // Extract image (fallback if needed)
              const imageUrl = event.coverImage || event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80";
              
              // Create custom icon using L.divIcon to allow HTML/CSS styling
              const customIcon = L.divIcon({
                className: "custom-event-marker",
                html: `<div style="
                  width: 56px; 
                  height: 56px; 
                  border-radius: 12px; 
                  overflow: hidden; 
                  border: 3px solid white; 
                  box-shadow: 0 4px 10px rgba(0,0,0,0.4);
                  background-image: url('${imageUrl}');
                  background-size: cover;
                  background-position: center;
                  transition: transform 0.2s;
                "></div>`,
                iconSize: [56, 56],
                iconAnchor: [28, 28],
                popupAnchor: [0, -28]
              });

              // Format Date
              let displayDate = event.date || "";
              if (event.dateTime) {
                const d = new Date(event.dateTime);
                displayDate = d.toLocaleDateString() + " a las " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              }

              return (
                <Marker 
                  key={event._id} 
                  position={[event.lat, event.lng]} 
                  icon={customIcon}
                >
                  <Popup className="event-popup" closeButton={false}>
                    <Link href={`/item/${event._id}`} className="block focus:outline-none w-[220px]">
                      <div className="flex flex-col group overflow-hidden rounded-lg bg-card">
                        <div className="relative w-full h-32 overflow-hidden bg-muted">
                          <img 
                            src={imageUrl} 
                            alt={event.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-bold text-[15px] leading-tight mb-1 line-clamp-2 text-foreground group-hover:text-primary transition-colors">{event.title}</h3>
                          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <span className="block truncate">{displayDate}</span>
                          </p>
                          <div className="mt-3 pt-2 border-t border-border/50 text-xs text-primary font-medium flex items-center justify-between">
                            <span>Ver detalles</span>
                            <span>&rarr;</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Popup>
                </Marker>
              );
            })}
            
            <FitBounds events={mapEvents} />
          </MapContainer>
        </div>
      </div>
      
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          overflow: hidden;
          padding: 0;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .leaflet-popup-tip-container {
          margin-top: -1px;
        }
        .custom-event-marker {
          background: transparent;
          border: none;
        }
        .custom-event-marker:hover div {
          transform: scale(1.1);
          border-color: var(--color-primary, #fff);
        }
      `}</style>
    </div>
  );
}
