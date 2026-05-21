"use client";

import { useEffect, useState } from "react";
import { Search as SearchIcon, SlidersHorizontal, MapPin, Users, Calendar, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EventCard } from "@/components/EventCard";
import { Label } from "@/components/ui/Label";
import { useTheme } from "@/context/ThemeContext";
import dynamic from "next/dynamic";
import { SignInButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full bg-muted rounded-2xl animate-pulse flex items-center justify-center text-sm text-muted-foreground border-2 border-dashed border-border">
      Cargando mapa...
    </div>
  ),
});

const categoriesList = [
  { name: "Tech", icon: "💻" },
  { name: "Social", icon: "🎉" },
  { name: "Fitness", icon: "💪" },
  { name: "Music", icon: "🎵" },
  { name: "Outdoor", icon: "🏞️" },
  { name: "Food", icon: "🍕" },
  { name: "Art", icon: "🎨" },
  { name: "Books", icon: "📚" },
  { name: "Sports", icon: "⚽" },
  { name: "Gaming", icon: "🎮" },
  { name: "Professional", icon: "💼" },
];

function mapEventToCard(ev) {
  const d = new Date(ev.dateTime);
  return {
    id: ev._id,
    image:
      ev.coverImage ||
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400",
    title: ev.title,
    date: d.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    dateTime: ev.dateTime,
    status: ev.status,
    location: ev.locationText,
    participants: ev.participantsCount || ev.participants?.length || 0,
    category: ev.categories?.[0] || "Evento",
    isTrending: (ev.participantsCount || 0) >= 50,
  };
}


export default function CategoriesPage() {
  const { isSignedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [filterLocationData, setFilterLocationData] = useState({
    address: "",
    lat: null,
    lng: null,
  });
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterMinParticipants, setFilterMinParticipants] = useState("");
  const [appliedLocation, setAppliedLocation] = useState("");
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");
  const [appliedMinParticipants, setAppliedMinParticipants] = useState("");
  const [locationPickerKey, setLocationPickerKey] = useState(0);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingResults, setLoadingResults] = useState(true);
  const [resultsError, setResultsError] = useState("");
  const { theme } = useTheme();
  const isHighContrast = theme === "high-contrast";

  const handleSearch = (e) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery.trim());
  };

  const toggleCategory = (name) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const clearAllCategories = () => setSelectedCategories(new Set());

  const resetAllFilters = () => {
    setSearchQuery("");
    setSubmittedQuery("");
    setSelectedCategories(new Set());

    setFilterLocationData({
      address: "",
      lat: null,
      lng: null,
    });
    setFilterStartDate("");
    setFilterEndDate("");
    setFilterMinParticipants("");

    setAppliedLocation("");
    setAppliedStartDate("");
    setAppliedEndDate("");
    setAppliedMinParticipants("");

    // Force remount so map picker returns to initial state as well.
    setLocationPickerKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (!isSignedIn) {
      setLoadingResults(false);
      setResultsError("");
      setEvents([]);
      setUsers([]);
      return;
    }

    const fetchEvents = async () => {
      setLoadingResults(true);
      setResultsError("");

      try {
        const params = new URLSearchParams();

        if (submittedQuery) {
          params.set("q", submittedQuery);
        }

        if (selectedCategories.size > 0) {
          params.set("categories", Array.from(selectedCategories).join(","));
        }

        if (appliedLocation.trim()) {
          params.set("location", appliedLocation.trim());
        }

        if (appliedStartDate) {
          params.set("startDate", appliedStartDate);
        }

        if (appliedEndDate) {
          params.set("endDate", appliedEndDate);
        }

        if (appliedMinParticipants) {
          params.set("minParticipants", appliedMinParticipants);
        }

        // Note: Our API returns { users: [...], events: [...] }
        const response = await fetch(`/api/events/search?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "No se pudieron cargar los datos.");
        }

        setEvents(data.events ? data.events.map(mapEventToCard) : []);
        setUsers(data.users || []);
      } catch (error) {
        setResultsError(error.message || "No se pudieron cargar los datos.");
        setEvents([]);
        setUsers([]);
      } finally {
        setLoadingResults(false);
      }
    };

    fetchEvents();
  }, [isSignedIn, submittedQuery, selectedCategories, appliedLocation, appliedStartDate, appliedEndDate, appliedMinParticipants]);

  const hasActiveFilters =
    selectedCategories.size > 0 ||
    submittedQuery.length > 0 ||
    appliedLocation.trim().length > 0 ||
    filterStartDate.length > 0 ||
    filterEndDate.length > 0 ||
    filterMinParticipants.length > 0;

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <SearchIcon className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-4">¡Únete a la comunidad!</h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Inicia sesión para poder buscar nuevas experiencias.
        </p>
        <SignInButton mode="modal">
          <Button size="lg" className="rounded-xl px-8 h-14 text-base shadow-lg">
            Iniciar Sesión ahora
          </Button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Search Section */}
      <section className="bg-card border-b border-border" aria-label="Buscador de eventos">
        <div className="w-full mx-auto px-6 md:px-8 lg:px-12 py-6 max-w-[1440px]">
          <h1 className="text-2xl font-bold mb-6">Descubrir Eventos o Personas</h1>

          <form onSubmit={handleSearch} className="flex gap-3 max-w-3xl mx-auto lg:mx-0">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary z-10" aria-hidden="true" />
              <Label htmlFor="global-search-input" className="sr-only">
                Buscar eventos, personas o temas
              </Label>
              <Input
                id="global-search-input"
                type="search"
                placeholder="Busca eventos, personas o temas..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value === "") {
                    setSubmittedQuery("");
                  }
                }}
                className="pl-12 h-12 rounded-xl relative z-0"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-xl flex-shrink-0"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-label="Filtros avanzados"
            >
              <SlidersHorizontal className="w-5 h-5 text-primary" aria-hidden="true" />
            </Button>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-6 bg-background rounded-2xl border border-border">
              <h2 className="text-lg font-semibold mb-4">Filtros avanzados para eventos</h2>
              <p className="text-sm text-muted-foreground mb-4">Ajusta tu búsqueda con estos filtros</p>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="filterLocation" className="mb-3 block">
                    <MapPin className="w-4 h-4 inline mr-1.5 text-secondary" aria-hidden="true" />
                    Ubicación
                  </Label>
                  <LocationPicker
                    key={locationPickerKey}
                    value={filterLocationData.address}
                    lat={filterLocationData.lat}
                    lng={filterLocationData.lng}
                    onChange={({ address, lat, lng }) => {
                      setFilterLocationData({ address, lat, lng });
                    }}
                  />
                </div>
                <div>
                  <Label className="mb-3 block">
                    <Calendar className="w-4 h-4 inline mr-1.5 text-primary" aria-hidden="true" />
                    Rango de fechas
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="filterStartDate" className="sr-only">Fecha de inicio</Label>
                      <Input
                        id="filterStartDate"
                        type="date"
                        className="h-12 rounded-xl"
                        value={filterStartDate}
                        onChange={(e) => setFilterStartDate(e.target.value)}
                        aria-label="Fecha de inicio"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="filterEndDate" className="sr-only">Fecha de finalización</Label>
                      <Input
                        id="filterEndDate"
                        type="date"
                        className="h-12 rounded-xl"
                        value={filterEndDate}
                        onChange={(e) => setFilterEndDate(e.target.value)}
                        aria-label="Fecha de finalización"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="filterParticipants" className="mb-3 block">
                    <Users className="w-4 h-4 inline mr-1.5 text-accent" aria-hidden="true" />
                    Mínimo de participantes
                  </Label>
                  <Input
                    id="filterParticipants"
                    type="number"
                    placeholder="p.ej., 10"
                    className="h-12 rounded-xl"
                    value={filterMinParticipants}
                    onChange={(e) => setFilterMinParticipants(e.target.value)}
                    min="0"
                  />
                </div>
                <div>
                  <Label className="mb-3 block">Categorías</Label>
                  <div className="flex flex-wrap gap-3">
                    {categoriesList.map((cat) => {
                      const isPressed = selectedCategories.has(cat.name);
                      return (
                        <button
                          key={cat.name}
                          type="button"
                          aria-pressed={isPressed}
                          onClick={() => toggleCategory(cat.name)}
                          className={`cursor-pointer px-4 py-2 rounded-full transition-all text-xs font-semibold border ${
                            isPressed
                              ? "bg-accent text-accent-foreground border-accent"
                              : "bg-transparent text-foreground border-input hover:border-accent"
                          }`}
                        >
                          <span className="mr-1.5" aria-hidden="true">{cat.icon}</span>
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    type="button"
                    className="h-12 rounded-xl"
                    onClick={() => {
                      setSubmittedQuery(searchQuery.trim());
                      setAppliedLocation(filterLocationData.address);
                      setAppliedStartDate(filterStartDate);
                      setAppliedEndDate(filterEndDate);
                      setAppliedMinParticipants(filterMinParticipants);
                    }}
                  >
                    Aplicar filtros
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-xl"
                    onClick={resetAllFilters}
                  >
                    Reiniciar filtros
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Category Filters */}
      <section className="bg-card border-b border-border" aria-label="Filtros por categoría">
        <div className="w-full mx-auto px-6 md:px-8 lg:px-12 py-5 max-w-[1440px]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-muted-foreground">Explorar por categoría</p>
            {selectedCategories.size > 0 && (
              <button
                onClick={clearAllCategories}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Limpiar ({selectedCategories.size})
              </button>
            )}
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {categoriesList.map((cat) => {
              const isActive = selectedCategories.has(cat.name);
              return (
                <button
                  key={cat.name}
                  onClick={() => toggleCategory(cat.name)}
                  aria-pressed={isActive}
                  className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 border ${
                    isActive
                      ? isHighContrast
                        ? "bg-yellow-400 text-black border-yellow-400 shadow-md"
                        : "bg-primary text-white border-primary shadow-md"
                      : isHighContrast
                      ? "bg-transparent text-foreground border-foreground hover:bg-foreground/10"
                      : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                  }`}
                >
                  <span aria-hidden="true">{cat.icon}</span>
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results or Empty State */}
      <section className="w-full mx-auto px-6 md:px-8 lg:px-12 py-8 max-w-[1440px]">
        {loadingResults ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : resultsError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {resultsError}
          </div>
        ) : (
          <div>
            {/* Results header */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <h3 className="font-semibold text-lg">
                {(events.length + users.length) === 1 ? "1 resultado encontrado" : `${events.length + users.length} resultados encontrados`}
              </h3>
              {!hasActiveFilters && (
                <span className="text-sm text-muted-foreground">Mostrando resultados recientes</span>
              )}
              {/* Active category pills */}
              {selectedCategories.size > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Array.from(selectedCategories).map((name) => {
                    const cat = categoriesList.find((c) => c.name === name);
                    return (
                      <button
                        key={name}
                        onClick={() => toggleCategory(name)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                          isHighContrast
                            ? "bg-yellow-400 text-black"
                            : "bg-accent text-accent-foreground"
                        }`}
                      >
                        <span>{cat?.icon}</span>
                        {name}
                        <X className="w-3 h-3 ml-0.5" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {events.length === 0 && users.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <SearchIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Sin resultados</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  No encontramos eventos ni usuarios con los filtros seleccionados. Prueba con otros términos.
                </p>
              </div>
            ) : (
              <>
                {users.length > 0 && (
                  <div className="mb-10">
                    <h3 className="font-semibold text-lg mb-4 text-muted-foreground">Perfiles encontrados</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {users.map(user => (
                        <Link href={`/user/${user.slug || user.username?.replace('@', '') || user._id}`} key={user._id}>
                          <div className="flex items-center gap-4 bg-card hover:bg-muted/50 transition-colors p-4 rounded-2xl border border-border shadow-sm group">
                            <div className="w-14 h-14 rounded-full bg-primary flex flex-shrink-0 items-center justify-center text-primary-foreground font-bold text-lg overflow-hidden">
                              {user.avatar ? (
                                <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                              ) : (
                                user.name?.substring(0,2).toUpperCase()
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{user.name}</p>
                              <p className="text-sm text-muted-foreground truncate">@{user.username?.replace('@', '')}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {events.length > 0 && (
                  <div>
                    {users.length > 0 && (
                      <h3 className="font-semibold text-lg mb-4 text-muted-foreground">Eventos</h3>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8">
                      {events.map((event) => (
                        <EventCard key={event.id} {...event} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
