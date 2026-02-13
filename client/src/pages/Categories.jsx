import { useState } from 'react'
import { Search as SearchIcon, SlidersHorizontal, MapPin, Users, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Label } from '../components/ui/Label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/ui/Sheet'
import { EventCard } from '../components/EventCard'
import { TopAppBar } from '../components/TopAppBar'
import { BottomNav } from '../components/BottomNav'

/**
 * Categorías disponibles para filtrar eventos
 */
const categories = [
  { name: 'Tech', icon: '💻' },
  { name: 'Social', icon: '🎉' },
  { name: 'Fitness', icon: '💪' },
  { name: 'Música', icon: '🎵' },
  { name: 'Naturaleza', icon: '🏞️' },
  { name: 'Comida', icon: '🍕' },
  { name: 'Arte', icon: '🎨' },
  { name: 'Libros', icon: '📚' },
]

/**
 * Datos mock para los resultados de búsqueda
 * TODO: Reemplazar con llamadas a API real
 */
const mockResults = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    title: 'Noche de Networking Tecnológico',
    date: '15 Feb, 2026',
    time: '19:00',
    location: 'Tech Hub Madrid, Madrid',
    participants: 45,
    categories: ['Tech', 'Social'],
    isTrending: true,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    title: 'Sesión de Yoga al Amanecer',
    date: '16 Feb, 2026',
    time: '06:30',
    location: 'Parque del Retiro, Madrid',
    participants: 28,
    categories: ['Fitness', 'Naturaleza'],
    isTrending: false,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
    title: 'Taller de Pintura Abstracta',
    date: '17 Feb, 2026',
    time: '18:00',
    location: 'Centro Cultural, Barcelona',
    participants: 15,
    categories: ['Arte'],
    isTrending: false,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    title: 'Cena Multicultural',
    date: '18 Feb, 2026',
    time: '20:00',
    location: 'Restaurante Fusión, Valencia',
    participants: 32,
    categories: ['Comida', 'Social'],
    isTrending: true,
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
    title: 'Club de Lectura: Ficción Moderna',
    date: '19 Feb, 2026',
    time: '17:30',
    location: 'Librería Central, Sevilla',
    participants: 12,
    categories: ['Libros'],
    isTrending: false,
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400',
    title: 'Concierto de Jazz en Vivo',
    date: '20 Feb, 2026',
    time: '21:00',
    location: 'Jazz Club, Bilbao',
    participants: 85,
    categories: ['Música'],
    isTrending: true,
  },
]

/**
 * Categories - Página de búsqueda y exploración de eventos
 * Permite buscar eventos por texto, filtrar por categoría y aplicar filtros avanzados
 * 
 * @component
 */
export default function Categories() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showResults, setShowResults] = useState(false)

  // Filtros avanzados
  const [filters, setFilters] = useState({
    location: '',
    dateFrom: '',
    dateTo: '',
    minParticipants: '',
  })

  /**
   * Maneja el envío del formulario de búsqueda
   */
  const handleSearch = (e) => {
    e.preventDefault()
    setShowResults(true)
  }

  /**
   * Aplica los filtros avanzados
   */
  const handleApplyFilters = () => {
    setShowResults(true)
    // Aquí se cerraría el Sheet automáticamente al aplicar
  }

  /**
   * Filtra los resultados según categoría seleccionada
   */
  const filteredResults = selectedCategory
    ? mockResults.filter((event) => event.categories.includes(selectedCategory))
    : mockResults

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopAppBar />

      {/* Sección de búsqueda */}
      <div className="bg-white border-b border-border">
        <div className="w-full mx-auto px-6 md:px-8 lg:px-12 py-6 max-w-[1440px]">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Descubre Eventos</h2>

          {/* Barra de búsqueda con filtros */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-3xl mx-auto lg:mx-0">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
              <Input
                type="search"
                placeholder="Buscar eventos, personas o temas..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (e.target.value) setShowResults(true)
                }}
                className="pl-12 h-12 rounded-xl"
              />
            </div>
            
            {/* Botón de filtros avanzados */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl flex-shrink-0">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="bottom" 
                className="h-[90vh] md:h-auto md:max-h-[80vh] overflow-y-auto rounded-t-3xl px-6 pt-8 pb-24 md:pb-8 md:max-w-2xl md:mx-auto"
              >
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-xl">Filtros Avanzados</SheetTitle>
                  <SheetDescription>
                    Refina tu búsqueda con estos filtros
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-8 pb-6">
                  {/* Filtro de ubicación */}
                  <div>
                    <Label htmlFor="filterLocation" className="mb-3 block">
                      <MapPin className="w-4 h-4 inline mr-1.5 text-secondary" />
                      Ubicación
                    </Label>
                    <Input
                      id="filterLocation"
                      placeholder="Ciudad o dirección..."
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      className="h-12 rounded-xl"
                    />
                  </div>

                  {/* Rango de fechas */}
                  <div>
                    <Label className="mb-3 block">
                      <Calendar className="w-4 h-4 inline mr-1.5 text-primary" />
                      Rango de Fechas
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="date"
                        placeholder="Desde"
                        value={filters.dateFrom}
                        onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                        className="h-12 rounded-xl"
                      />
                      <Input
                        type="date"
                        placeholder="Hasta"
                        value={filters.dateTo}
                        onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Cantidad de participantes */}
                  <div>
                    <Label htmlFor="filterParticipants" className="mb-3 block">
                      <Users className="w-4 h-4 inline mr-1.5 text-accent" />
                      Mínimo de Participantes
                    </Label>
                    <Input
                      id="filterParticipants"
                      type="number"
                      placeholder="ej. 10"
                      value={filters.minParticipants}
                      onChange={(e) => setFilters({ ...filters, minParticipants: e.target.value })}
                      className="h-12 rounded-xl"
                    />
                  </div>

                  {/* Filtro de categorías */}
                  <div>
                    <Label className="mb-3 block">Categorías</Label>
                    <div className="flex flex-wrap gap-3">
                      {categories.map((cat) => (
                        <Badge
                          key={cat.name}
                          variant={selectedCategory === cat.name ? 'default' : 'outline'}
                          className={`cursor-pointer px-4 py-2 rounded-full transition-all ${
                            selectedCategory === cat.name
                              ? 'bg-accent text-white'
                              : 'hover:border-accent'
                          }`}
                          onClick={() =>
                            setSelectedCategory(selectedCategory === cat.name ? null : cat.name)
                          }
                        >
                          <span className="mr-1.5">{cat.icon}</span>
                          {cat.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleApplyFilters} className="w-full h-12 rounded-xl">
                    Aplicar Filtros
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </form>
        </div>
      </div>

      {/* Filtros rápidos por categoría */}
      <div className="bg-white border-b border-border">
        <div className="w-full mx-auto px-6 md:px-8 lg:px-12 py-6 max-w-[1440px]">
          <p className="text-sm font-semibold mb-4 text-muted-foreground">Explorar por Categoría</p>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {categories.map((cat) => (
              <Badge
                key={cat.name}
                variant={selectedCategory === cat.name ? 'default' : 'secondary'}
                className={`cursor-pointer whitespace-nowrap px-4 py-2 rounded-full transition-all flex-shrink-0 ${
                  selectedCategory === cat.name
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white hover:bg-muted'
                }`}
                onClick={() => {
                  setSelectedCategory(selectedCategory === cat.name ? null : cat.name)
                  setShowResults(true)
                }}
              >
                <span className="mr-1.5">{cat.icon}</span>
                {cat.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Resultados o estado vacío */}
      <div className="w-full mx-auto px-6 md:px-8 lg:px-12 py-8 max-w-[1440px]">
        {!showResults && !searchQuery ? (
          // Estado vacío - Sin búsqueda
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
              <SearchIcon className="w-10 h-10 text-secondary" />
            </div>
            <h3 className="font-semibold text-xl mb-3">Descubre Eventos Increíbles</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
              Busca eventos por nombre, explora por categoría o usa filtros para encontrar el
              meetup perfecto
            </p>
          </div>
        ) : (
          // Resultados de búsqueda
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h3 className="font-semibold text-lg">
                {filteredResults.length} Evento{filteredResults.length !== 1 ? 's' : ''} Encontrado
                {filteredResults.length !== 1 ? 's' : ''}
              </h3>
              {selectedCategory && (
                <Badge className="bg-accent text-white px-4 py-2 rounded-full">
                  <span className="mr-1.5">
                    {categories.find((c) => c.name === selectedCategory)?.icon}
                  </span>
                  {selectedCategory}
                </Badge>
              )}
            </div>

            {/* Grid responsive de eventos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8">
              {filteredResults.map((event) => (
                <Link key={event.id} to={`/event/${event.id}`}>
                  <EventCard {...event} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
