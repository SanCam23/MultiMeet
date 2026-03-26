"use client";

import { useState, useMemo } from "react";
import { Search as SearchIcon, SlidersHorizontal, MapPin, Users, Calendar, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EventCard } from "@/components/EventCard";
import { Label } from "@/components/ui/Label";

const categoriesList = [
  { name: "Tech", icon: "💻" },
  { name: "Social", icon: "🎉" },
  { name: "Fitness", icon: "💪" },
  { name: "Music", icon: "🎵" },
  { name: "Outdoor", icon: "🏞️" },
  { name: "Food", icon: "🍕" },
  { name: "Art", icon: "🎨" },
  { name: "Books", icon: "📚" },
];

const allEvents = [
  {
    id: "s-tech-1",
    image: "https://images.unsplash.com/photo-1760642626994-8ebd037f78dc?w=400",
    title: "Tech Networking Night",
    date: "Feb 15, 2026",
    time: "7:00 PM",
    location: "Downtown Tech Hub, San Francisco",
    participants: 45,
    category: "Tech",
    isTrending: true,
  },
  {
    id: "s-social-1",
    image: "https://images.unsplash.com/photo-1759074037385-0ad31887b14f?w=400",
    title: "Coffee & Conversation Morning",
    date: "Feb 14, 2026",
    time: "9:00 AM",
    location: "Blue Bottle Coffee, Oakland",
    participants: 12,
    category: "Social",
  },
  {
    id: "s-music-1",
    image: "https://images.unsplash.com/photo-1672841821756-fc04525771c2?w=400",
    title: "Indie Music Festival",
    date: "Feb 20, 2026",
    time: "5:00 PM",
    location: "The Fillmore, San Francisco",
    participants: 156,
    category: "Music",
    isTrending: true,
  },
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

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

  const hasActiveFilters = selectedCategories.size > 0 || submittedQuery.length > 0;

  const filteredEvents = useMemo(() => {
    let results = allEvents;

    if (selectedCategories.size > 0) {
      results = results.filter((e) => selectedCategories.has(e.category));
    }

    if (submittedQuery) {
      const q = submittedQuery.toLowerCase();
      results = results.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }

    return results;
  }, [selectedCategories, submittedQuery]);

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Search Section */}
      <section className="bg-card border-b border-border" aria-label="Buscador de eventos">
        <div className="w-full mx-auto px-6 md:px-8 lg:px-12 py-6 max-w-[1440px]">
          <h1 className="text-2xl font-bold mb-6">Descubrir Eventos</h1>

          <form onSubmit={handleSearch} className="flex gap-3 max-w-3xl mx-auto lg:mx-0">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Busca eventos, personas o temas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl"
                aria-label="Campo de búsqueda"
              />
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-xl flex-shrink-0"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-label="Mostrar u ocultar filtros avanzados"
            >
              <SlidersHorizontal className="w-5 h-5 text-primary" aria-hidden="true" />
            </Button>
          </form>

          {showFilters && (
            <div className="mt-6 p-6 bg-background rounded-2xl border border-border transition-all">
              <h2 className="text-lg font-semibold mb-4">Filtros avanzados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="filterLocation" className="mb-2 block">
                    <MapPin className="w-4 h-4 inline mr-1.5 text-secondary" aria-hidden="true" /> Ubicación
                  </Label>
                  <Input id="filterLocation" placeholder="Ciudad o dirección..." className="h-11 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="filterDate" className="mb-2 block">
                    <Calendar className="w-4 h-4 inline mr-1.5 text-primary" aria-hidden="true" /> Fecha límite
                  </Label>
                  <Input id="filterDate" type="date" className="h-11 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="filterParticipants" className="mb-2 block">
                    <Users className="w-4 h-4 inline mr-1.5 text-accent" aria-hidden="true" /> Mín. participantes
                  </Label>
                  <Input id="filterParticipants" type="number" placeholder="Ej. 10" className="h-11 rounded-xl" />
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
            <h2 className="text-sm font-semibold text-muted-foreground">Explorar por categoría</h2>
            {selectedCategories.size > 0 && (
              <button
                onClick={clearAllCategories}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:underline"
                aria-label="Limpiar todos los filtros de categoría"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                Limpiar ({selectedCategories.size})
              </button>
            )}
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide" role="group">
            {categoriesList.map((cat) => {
              const isActive = selectedCategories.has(cat.name);
              return (
                <button
                  key={cat.name}
                  onClick={() => toggleCategory(cat.name)}
                  aria-pressed={isActive}
                  className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 border focus:outline-none focus:ring-2 focus:ring-ring ${
                    isActive
                      ? "bg-primary text-white border-primary shadow-md"
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
      <section className="w-full mx-auto px-6 md:px-8 lg:px-12 py-8 max-w-[1440px]" aria-label="Resultados de búsqueda">
        {!hasActiveFilters ? (
          <div className="text-center py-16">
             <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
              <SearchIcon className="w-10 h-10 text-secondary" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-xl mb-3">Descubre Eventos Increíbles</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
              Busca eventos por nombre, explora por categoría o usa filtros para encontrar tu meetup
            </p>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <h3 className="font-semibold text-lg" aria-live="polite">
                {filteredEvents.length} {filteredEvents.length === 1 ? "Evento encontrado" : "Eventos encontrados"}
              </h3>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-2xl border border-border">
                <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                <h3 className="font-semibold text-lg mb-2">Sin resultados</h3>
                <p className="text-muted-foreground text-sm">Prueba ajustando tus parámetros de búsqueda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
