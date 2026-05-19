"use client";

import { useState, useEffect } from "react";
import { EventCard } from "@/components/EventCard";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@clerk/nextjs";
import { Map, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const HomeMap = dynamic(() => import("@/components/HomeMap"), { ssr: false });

const tabs = [
  { value: "topInCity", label: "Top Ciudad" },
  { value: "following", label: "Siguiendo" },
  { value: "topGlobal", label: "Top Global" },
];

export default function HomePage() {
  const router = useRouter();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const [activeTab, setActiveTab] = useState("topGlobal");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [radius, setRadius] = useState(5); // Default 5km
  const [locationError, setLocationError] = useState(false);
  const { theme } = useTheme();
  const isHighContrast = theme === "high-contrast";

  async function fetchEvents(tab, r) {
    try {
      setLoading(true);
      const params = new URLSearchParams({ tab });
      if (tab === "topInCity") {
        params.append("radius", r);
      }
      const res = await fetch(`/api/events/home?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
        setLocationError(false);
      } else {
        const data = await res.json();
        if (data.error === "LOCATION_NOT_SET") {
          setLocationError(true);
          setEvents([]);
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }

  // Wait for auth to be resolved before setting the tab and fetching
  useEffect(() => {
    if (!authLoaded) return;
    const defaultTab = isSignedIn ? "topInCity" : "topGlobal";
    setActiveTab(defaultTab);
    fetchEvents(defaultTab, radius);
  }, [authLoaded, isSignedIn]);

  // Re-fetch when the user manually changes tabs
  useEffect(() => {
    if (!authLoaded) return;
    fetchEvents(activeTab, radius);
  }, [activeTab, radius]); // Añadido radius para mayor seguridad, aunque activeTab es el trigger principal

  // Escuchar cambios en la ubicación del perfil (para corregir el lag post-onboarding)
  useEffect(() => {
    const handleProfileUpdate = () => {
      if (activeTab === "topInCity") {
        fetchEvents("topInCity", radius);
      }
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, [activeTab, radius]);

  const handleRadiusChange = (e) => {
    const newRadius = parseInt(e.target.value);
    setRadius(newRadius);
    if (activeTab === "topInCity") {
      fetchEvents(activeTab, newRadius);
    }
  };

  return (
    <section aria-label="Eventos" className="relative min-h-screen">
      <div className="w-full mx-auto px-6 md:px-8 lg:px-12 pt-6 pb-8 max-w-[1440px]">
        {/* Tabs */}
        <div className="max-w-2xl mx-auto mb-4" role="tablist" aria-label="Categorías de eventos">
          {isSignedIn ? (
            <div className="grid w-full grid-cols-3 h-12 bg-card rounded-xl p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  role="tab"
                  aria-selected={activeTab === tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`rounded-lg text-sm md:text-base font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring ${activeTab === tab.value
                    ? `bg-primary ${isHighContrast ? "text-black" : "text-primary-foreground"} shadow-sm`
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-12 bg-card rounded-xl p-1 w-full max-w-[200px]">
                <button
                  role="tab"
                  aria-selected={true}
                  className={`w-full h-full rounded-lg text-sm md:text-base font-medium transition-colors focus:outline-none bg-primary ${isHighContrast ? "text-black" : "text-primary-foreground"} shadow-sm`}
                >
                  Top Global
                </button>
              </div>
            </div>
          )}
        </div>

        {activeTab === "topInCity" && (
          <div className="max-w-xs mx-auto mb-8 flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Radio de búsqueda: {radius} km
            </span>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={radius}
              onChange={handleRadiusChange}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        )}

        {/* Event Grid */}
        <div
          role="tabpanel"
          aria-label={tabs.find((t) => t.value === activeTab)?.label}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8"
        >
          {loading ? (
            <div className="col-span-full text-center py-10">Cargando eventos...</div>
          ) : events.length > 0 ? (
            events.map((event) => (
              <EventCard key={event._id} {...event} id={event._id} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              {activeTab === "following"
                ? "No sigues a nadie o no hay eventos recientes de quienes sigues."
                : activeTab === "topInCity"
                  ? locationError
                    ? (
                      <div className="flex flex-col items-center gap-4 bg-card p-8 rounded-3xl border border-border shadow-sm max-w-md mx-auto">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                          <MapPin className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Ubicación no definida</h3>
                        <p className="text-sm">Para ver los eventos más populares en tu ciudad, primero debes configurar tu ubicación en tu perfil.</p>
                        <button
                          onClick={() => router.push("/dashboard?edit=true")}
                          className="mt-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
                        >
                          Ir a mi perfil
                        </button>
                      </div>
                    )
                    : "No se han encontrado eventos en tu zona."
                  : "No se han encontrado eventos."}
            </div>
          )}
        </div>
      </div>

      {/* Floating Map Button */}
      <button
        onClick={() => setShowMap(true)}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-40 bg-primary text-primary-foreground p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center justify-center"
        aria-label="Abrir mapa de eventos"
      >
        <Map className="w-6 h-6 md:w-7 md:h-7" />
      </button>

      {/* Map Overlay */}
      {showMap && <HomeMap events={events} onClose={() => setShowMap(false)} />}
    </section>
  );
}
