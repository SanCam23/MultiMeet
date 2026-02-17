import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Tag, Image as ImageIcon } from 'lucide-react'
import { TopAppBar } from '../components/TopAppBar'
import { BottomNav } from '../components/BottomNav'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Textarea } from '../components/ui/Textarea'
import { Badge } from '../components/ui/Badge'


const CATEGORIES = [
  'Tecnología', 'Social', 'Fitness', 'Música', 'Aire Libre', 'Gastronomía',
  'Arte', 'Libros', 'Deportes', 'Gaming', 'Profesional',
]


const MOCK_PARENT_EVENTS = [
  { id: '1', title: 'Noche de Networking Tecnológico' },
  { id: '2', title: 'Café y Conversación Matutina' },
  { id: '3', title: 'Sesión de Yoga al Amanecer' },
]


export default function UploadForm() {
  const navigate = useNavigate()
  const [selectedCategories, setSelectedCategories] = useState([])
  const [formType, setFormType] = useState('new')


  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    alert('¡Meetup creado correctamente!')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Barra de navegación superior */}
      <TopAppBar />

      {/* Contenedor principal */}
      <main className="w-full mx-auto px-6 md:px-8 lg:px-12 pt-8 pb-24 md:pb-8 max-w-[900px]">
        {/* Selector de tipo de formulario */}
        <Tabs value={formType} onValueChange={setFormType}>
          <div className="max-w-md mx-auto mb-8">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="new">
                Nuevo Meetup
              </TabsTrigger>
              <TabsTrigger value="extend">
                Extender Evento
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ─── Tab: Nuevo Meetup ─── */}
          <TabsContent value="new" className="mt-0">
            <NewMeetupForm
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
              onSubmit={handleSubmit}
            />
          </TabsContent>

          {/* ─── Tab: Extender Evento ─── */}
          <TabsContent value="extend" className="mt-0">
            <ExtendEventForm onSubmit={handleSubmit} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Navegación inferior para móviles */}
      <BottomNav />
    </div>
  )
}




function NewMeetupForm({ selectedCategories, onToggleCategory, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Imagen de portada */}
      <CoverImageUpload />

      {/* Título */}
      <div>
        <Label htmlFor="title" className="mb-3 block">Título del Evento</Label>
        <Input
          id="title"
          placeholder="Dale un título atractivo a tu meetup"
          className="h-12 rounded-xl"
          required
        />
      </div>

      {/* Descripción */}
      <div>
        <Label htmlFor="description" className="mb-3 block">Descripción</Label>
        <Textarea
          id="description"
          placeholder="Cuéntale a la gente de qué trata tu meetup..."
          className="min-h-32 rounded-xl"
          required
        />
      </div>

      {/* Categorías */}
      <CategorySelector
        selectedCategories={selectedCategories}
        onToggleCategory={onToggleCategory}
      />

      {/* Ubicación */}
      <div>
        <Label htmlFor="location" className="mb-3 block">
          <MapPin className="w-4 h-4 inline mr-1.5 text-secondary" />
          Ubicación
        </Label>
        <Input
          id="location"
          placeholder="Buscar una ubicación..."
          className="h-12 rounded-xl"
          required
        />
      </div>

      {/* Fecha y Hora */}
      <DateTimeFields idPrefix="" />

      {/* Participantes máximos */}
      <div>
        <Label htmlFor="maxParticipants" className="mb-3 block">
          Participantes Máximos (Opcional)
        </Label>
        <Input
          id="maxParticipants"
          type="number"
          placeholder="Sin límite"
          className="h-12 rounded-xl"
        />
      </div>

      <Button type="submit" className="w-full h-14 text-base rounded-xl shadow-lg" size="lg">
        Publicar Meetup
      </Button>
    </form>
  )
}


function ExtendEventForm({ onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Selector de evento padre */}
      <div>
        <Label htmlFor="parentEvent" className="mb-3 block">Extender desde Evento</Label>
        <select
          id="parentEvent"
          className="w-full h-12 px-4 bg-card border border-input rounded-xl text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          required
        >
          <option value="">Selecciona un evento...</option>
          {MOCK_PARENT_EVENTS.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>

      {/* Título de la extensión */}
      <div>
        <Label htmlFor="extensionTitle" className="mb-3 block">Tu Aportación</Label>
        <Input
          id="extensionTitle"
          placeholder="¿Qué estás añadiendo a este evento?"
          className="h-12 rounded-xl"
          required
        />
      </div>

      {/* Detalles */}
      <div>
        <Label htmlFor="extensionDetails" className="mb-3 block">Detalles</Label>
        <Textarea
          id="extensionDetails"
          placeholder="Describe tu contribución..."
          className="min-h-32 rounded-xl"
          required
        />
      </div>

      {/* Fecha y Hora */}
      <DateTimeFields idPrefix="ext-" />

      <Button type="submit" className="w-full h-14 text-base rounded-xl shadow-lg" size="lg">
        Publicar Extensión
      </Button>
    </form>
  )
}




function CoverImageUpload() {
  return (
    <div>
      <Label className="mb-3 block">Imagen de Portada</Label>
      <div className="border-2 border-dashed border-border rounded-2xl h-48 flex flex-col items-center justify-center gap-3 bg-card hover:bg-muted/20 transition-colors cursor-pointer">
        <ImageIcon className="w-12 h-12 text-secondary" />
        <Button type="button" variant="outline" size="sm" className="rounded-xl">
          Subir Imagen
        </Button>
        <p className="text-xs text-muted-foreground">
          JPG, PNG o GIF (máximo 5MB)
        </p>
      </div>
    </div>
  )
}


function CategorySelector({ selectedCategories, onToggleCategory }) {
  return (
    <div>
      <Label className="mb-3 block">
        <Tag className="w-4 h-4 inline mr-1.5 text-accent" />
        Categorías
      </Label>
      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategories.includes(category)
          return (
            <Badge
              key={category}
              variant={isSelected ? 'accent' : 'outline'}
              className={`cursor-pointer px-4 py-2 rounded-full transition-all ${isSelected
                ? 'hover:bg-accent/90'
                : 'hover:border-accent'
                }`}
              onClick={() => onToggleCategory(category)}
            >
              {category}
            </Badge>
          )
        })}
      </div>
    </div>
  )
}


function DateTimeFields({ idPrefix = '' }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label htmlFor={`${idPrefix}date`} className="mb-3 block">
          <Calendar className="w-4 h-4 inline mr-1.5 text-primary" />
          Fecha
        </Label>
        <Input
          id={`${idPrefix}date`}
          type="date"
          className="h-12 rounded-xl"
          required
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}time`} className="mb-3 block">Hora</Label>
        <Input
          id={`${idPrefix}time`}
          type="time"
          className="h-12 rounded-xl"
          required
        />
      </div>
    </div>
  )
}