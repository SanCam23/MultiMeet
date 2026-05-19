"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, Navigation, Search, Loader2 } from "lucide-react";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import debounce from "lodash.debounce";

// Custom marker icon with explicit anchors to avoid "drifting" on zoom
const customIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapEvents({ onChange }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom(), {
        animate: true,
        duration: 1.5,
      });
    }
  }, [center, map]);
  return null;
}

export default function LocationPicker({ value, lat, lng, onChange }) {
  const [position, setPosition] = useState(lat && lng ? [lat, lng] : [40.4168, -3.7038]); // Madrid default
  const [address, setAddress] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reverse Geocoding (Coords -> Address)
  const reverseGeocode = async (lat, lng) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      if (!response.ok) throw new Error("Error en geocodificación inversa");

      const text = await response.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Respuesta inválida de la API del mapa");
      }

      const formattedAddress = data.display_name || `${lat}, ${lng}`;
      setAddress(formattedAddress);
      onChange({ address: formattedAddress, lat, lng });
    } catch (err) {
      console.error("Error reverse geocoding:", err);
    } finally {
      setLoading(false);
    }
  };

  // Forward Geocoding (Address -> Coords)
  const searchAddress = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&limit=5&addressdetails=1`
      );
      if (!response.ok) throw new Error("Error en la búsqueda del mapa");

      const text = await response.text();
      let data = [];
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Respuesta inválida de la API del mapa");
      }

      setSuggestions(data || []);
    } catch (err) {
      // Usamos console.warn en lugar de error para que Next.js no salte el error overlay completo
      console.warn("Aviso al buscar dirección (posible límite de peticiones):", err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectSuggestion = (item) => {
    const newLat = parseFloat(item.lat);
    const newLng = parseFloat(item.lon);
    const selectedAddress = item.display_name;

    setPosition([newLat, newLng]);
    setAddress(selectedAddress);
    setSuggestions([]);
    onChange({ address: selectedAddress, lat: newLat, lng: newLng });
  };

  const debouncedSearch = useCallback(
    debounce((query) => searchAddress(query), 500),
    []
  );

  const handleMapClick = (newLat, newLng) => {
    setPosition([newLat, newLng]);
    reverseGeocode(newLat, newLng);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        reverseGeocode(latitude, longitude);
      },
      (err) => {
        // Silenciar error en consola si el usuario rechaza el permiso pero notificar que ya no se está cargando
        if (err.code !== err.PERMISSION_DENIED) {
          console.error("Error getting location:", err);
        }
        setLoading(false);
      }
    );
  };

  return (
    <div className="flex flex-col gap-3 relative" ref={dropdownRef}>
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Busca una dirección o haz clic en el mapa..."
          className="w-full pl-10 pr-12 py-3 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            debouncedSearch(e.target.value);
          }}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
          {searching && <Loader2 className="w-4 h-4 animate-spin text-primary mr-2" />}
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={loading}
            className="p-2 hover:bg-muted rounded-xl text-primary transition-colors disabled:opacity-50"
            title="Usar ubicación actual"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl z-[2000] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {suggestions.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full text-left px-4 py-3 hover:bg-muted transition-colors text-sm border-b border-border last:border-0 flex items-start gap-3"
              >
                <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span className="truncate">{item.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-64 w-full rounded-2xl overflow-hidden border border-border shadow-inner relative z-0">
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={customIcon} />
          <MapEvents onChange={handleMapClick} />
          <ChangeView center={position} />
        </MapContainer>

        {/* Overlay pulse when loading */}
        {loading && (
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] z-[1000] flex items-center justify-center pointer-events-none">
            <div className="bg-card/80 p-3 rounded-full shadow-lg">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          </div>
        )}
      </div>

      <p className="text-[10px] text-muted-foreground flex items-center gap-1 px-1">
        <MapPin className="w-3 h-3 text-primary" />
        Haz clic en el mapa para ajustar tu posición exacta
      </p>
    </div>
  );
}
