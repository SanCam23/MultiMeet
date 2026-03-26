"use client";

import { useState, useMemo } from "react";
import { Search as SearchIcon, SlidersHorizontal, MapPin, Users, Calendar, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EventCard } from "@/components/EventCard";
import { Label } from "@/components/ui/Label";
import { useTheme } from "@/context/ThemeContext";

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
  { id: "s-tech-1", image: "https://images.unsplash.com/photo-1760642626994-8ebd037f78dc?w=400", title: "Tech Networking Night", date: "Feb 15, 2026", time: "7:00 PM", location: "Downtown Tech Hub, San Francisco", participants: 45, category: "Tech", isTrending: true },
  { id: "s-tech-2", image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400", title: "AI & Machine Learning Meetup", date: "Feb 22, 2026", time: "6:30 PM", location: "Innovation Hub, Palo Alto", participants: 60, category: "Tech" },
  { id: "s-social-1", image: "https://images.unsplash.com/photo-1759074037385-0ad31887b14f?w=400", title: "Coffee & Conversation Morning", date: "Feb 14, 2026", time: "9:00 AM", location: "Blue Bottle Coffee, Oakland", participants: 12, category: "Social" },
  { id: "s-social-2", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400", title: "Rooftop Social Mixer", date: "Feb 28, 2026", time: "7:30 PM", location: "Rooftop Lounge, San Francisco", participants: 80, category: "Social", isTrending: true },
  { id: "s-fitness-1", image: "https://images.unsplash.com/photo-1644612105654-b6b0a941ecde?w=400", title: "Sunrise Yoga Session", date: "Feb 16, 2026", time: "6:30 AM", location: "Golden Gate Park", participants: 28, category: "Fitness" },
  { id: "s-fitness-2", image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400", title: "5K Run for a Cause", date: "Mar 1, 2026", time: "8:00 AM", location: "Embarcadero, San Francisco", participants: 120, category: "Fitness", isTrending: true },
  { id: "s-music-1", image: "https://images.unsplash.com/photo-1672841821756-fc04525771c2?w=400", title: "Indie Music Festival", date: "Feb 20, 2026", time: "5:00 PM", location: "The Fillmore, San Francisco", participants: 156, category: "Music", isTrending: true },
  { id: "s-music-2", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400", title: "Jazz Night at the Harbor", date: "Feb 27, 2026", time: "8:00 PM", location: "Pier 39, San Francisco", participants: 75, category: "Music" },
  { id: "s-outdoor-1", image: "https://images.unsplash.com/photo-1770564512491-e88eb93d48a3?w=400", title: "Weekend Hiking Adventure", date: "Feb 18, 2026", time: "8:00 AM", location: "Mount Tamalpais Trailhead", participants: 34, category: "Outdoor", isTrending: true },
  { id: "s-outdoor-2", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400", title: "Cycling Tour Through Marin", date: "Mar 7, 2026", time: "9:00 AM", location: "Marin County, California", participants: 22, category: "Outdoor" },
  { id: "s-food-1", image: "https://images.unsplash.com/photo-1762994576926-b8268190a2c9?w=400", title: "Italian Cooking Workshop", date: "Feb 17, 2026", time: "6:00 PM", location: "Culinary Institute, Berkeley", participants: 20, category: "Food" },
  { id: "s-food-2", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400", title: "Street Food Tour Mission District", date: "Feb 21, 2026", time: "1:00 PM", location: "Mission District, San Francisco", participants: 30, category: "Food", isTrending: true },
  { id: "s-art-1", image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400", title: "Urban Sketching Walk", date: "Feb 19, 2026", time: "10:00 AM", location: "SOMA Arts District, San Francisco", participants: 18, category: "Art" },
  { id: "s-art-2", image: "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=400", title: "Open Studio Night", date: "Feb 26, 2026", time: "6:00 PM", location: "Dogpatch Studios, San Francisco", participants: 40, category: "Art" },
  { id: "s-books-1", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400", title: "Sci-Fi Book Club Meetup", date: "Feb 23, 2026", time: "5:00 PM", location: "Green Apple Books, San Francisco", participants: 15, category: "Books" },
  { id: "s-books-2", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400", title: "Author Reading & Q&A Evening", date: "Mar 3, 2026", time: "7:00 PM", location: "City Lights Bookstore, San Francisco", participants: 50, category: "Books", isTrending: true },
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
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
    <div className="min-h-screen bg-background">
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
              <h2 className="text-lg font-semibold mb-4">Filtros avanzados</h2>
              <p className="text-sm text-muted-foreground mb-4">Ajusta tu búsqueda con estos filtros</p>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="filterLocation" className="mb-3 block">
                    <MapPin className="w-4 h-4 inline mr-1.5 text-secondary" aria-hidden="true" />
                    Ubicación
                  </Label>
                  <Input id="filterLocation" placeholder="Ciudad o dirección..." className="h-12 rounded-xl" />
                </div>
                <div>
                  <Label className="mb-3 block">
                    <Calendar className="w-4 h-4 inline mr-1.5 text-primary" aria-hidden="true" />
                    Rango de fechas
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input type="date" className="h-12 rounded-xl" />
                    <Input type="date" className="h-12 rounded-xl" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="filterParticipants" className="mb-3 block">
                    <Users className="w-4 h-4 inline mr-1.5 text-accent" aria-hidden="true" />
                    Mínimo de participantes
                  </Label>
                  <Input id="filterParticipants" type="number" placeholder="p.ej., 10" className="h-12 rounded-xl" />
                </div>
                <div>
                  <Label className="mb-3 block">Categorías</Label>
                  <div className="flex flex-wrap gap-3">
                    {categoriesList.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => toggleCategory(cat.name)}
                        className={`cursor-pointer px-4 py-2 rounded-full transition-all text-xs font-semibold border ${
                          selectedCategories.has(cat.name)
                            ? "bg-accent text-accent-foreground border-accent"
                            : "bg-transparent text-foreground border-input hover:border-accent"
                        }`}
                      >
                        <span className="mr-1.5">{cat.icon}</span>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                <Button className="w-full h-12 rounded-xl">Aplicar filtros</Button>
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
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results or Empty State */}
      <section className="w-full mx-auto px-6 md:px-8 lg:px-12 py-8 max-w-[1440px]">
        {!hasActiveFilters ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
              <SearchIcon className="w-10 h-10 text-secondary" />
            </div>
            <h3 className="font-semibold text-xl mb-3">Descubre Eventos Increíbles</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
              Busca eventos por nombre, explora por categoría o usa filtros para encontrar el meetup perfecto
            </p>
          </div>
        ) : (
          <div>
            {/* Results header */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <h3 className="font-semibold text-lg">
                {filteredEvents.length} {filteredEvents.length === 1 ? "Evento encontrado" : "Eventos encontrados"}
              </h3>
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

            {filteredEvents.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <SearchIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Sin resultados</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  No encontramos eventos con los filtros seleccionados. Prueba con otras categorías.
                </p>
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
