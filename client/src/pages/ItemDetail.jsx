import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, Users, Star, Trash2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { StarRating } from '../components/StarRating'
import { useState } from 'react'

/**
 * Datos mock para eventos
 * TODO: Reemplazar con llamadas a la API cuando el backend esté listo
 */
const mockEventData = {
  '1': {
    status: 'active',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop',
    title: 'Noche de Networking Tecnológico',
    date: '15 Feb, 2026',
    time: '19:00',
    location: 'Tech Hub Madrid, Calle Gran Vía 28, Madrid 28013',
    participants: 45,
    categories: ['Tecnología', 'Networking', 'Profesional'],
    description:
      'Únete a nosotros para una noche de networking con profesionales de la tecnología. Comparte ideas, haz conexiones y explora oportunidades de colaboración en un ambiente relajado y amigable. Habrá bebidas y aperitivos.',
  },
  '2': {
    status: 'active',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=600&fit=crop',
    title: 'Café y Conversación Matutina',
    date: '14 Feb, 2026',
    time: '09:00',
    location: 'Café Central, Plaça de Catalunya, Barcelona 08002',
    participants: 12,
    categories: ['Social', 'Casual'],
    description:
      'Comienza tu día con una buena conversación y café de calidad. Un espacio informal para conocer gente nueva, compartir experiencias y crear nuevas amistades.',
  },
  '4': {
    status: 'finished',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=600&fit=crop',
    title: 'Festival de Música Indie',
    date: '10 Ago, 2025',
    time: '17:00',
    location: 'Sala Apolo, Barcelona',
    participants: 156,
    categories: ['Música', 'Festival', 'Outdoor'],
    description:
      'Un día increíble de música en vivo con artistas locales e internacionales.',
    memories: [
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=900&fit=crop',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=700&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=500&fit=crop',
    ],
    featuredMemory: 0,
  },
}

/**
 * ItemDetail - Página de detalle de un evento
 * Muestra toda la información del evento, permite unirse o calificar (si ya finalizó)
 */
export default function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)

  // Obtener datos del evento
  const event = mockEventData[id] || mockEventData['1']
  const isFinished = event.status === 'finished'

  const handleJoin = () => {
    // TODO: Implementar lógica de unirse al evento con API
    alert('¡Te has unido al evento exitosamente!')
  }

  const handleRatingSubmit = () => {
    if (rating > 0) {
      // TODO: Implementar envío de calificación a la API
      alert(`¡Gracias por calificar este evento con ${rating} estrellas!`)
    }
  }

  const handleDeleteMemory = (index) => {
    // TODO: Implementar eliminación de memoria con API
    alert(`Eliminar memoria ${index + 1}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Imagen Hero */}
      <div className="relative h-72 md:h-96 lg:h-[28rem]">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {/* Botón de volver */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-card rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          aria-label="Volver"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Contenedor de contenido - Responsive con max-width */}
      <div className="w-full mx-auto px-6 md:px-8 lg:px-12 py-8 max-w-[1000px]">
        {/* Título y Categorías */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-foreground">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {event.categories.map((category) => (
              <Badge
                key={category}
                variant="accent"
                className="px-4 py-2 rounded-full text-sm"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Card de Información del Evento */}
        <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-md space-y-6 mb-8">
          {/* Fecha y Hora */}
          <div className="flex items-start gap-4">
            <Calendar className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-1">Fecha y Hora</p>
              <p className="text-sm text-muted-foreground">
                {event.date} a las {event.time}
              </p>
            </div>
          </div>

          {/* Ubicación */}
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-secondary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold mb-1">Ubicación</p>
              <p className="text-sm text-muted-foreground">{event.location}</p>
            </div>
          </div>

          {/* Mini Mapa Placeholder */}
          <div className="h-40 md:h-48 bg-muted rounded-xl overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-secondary/40" />
              <span className="ml-3 text-muted-foreground text-sm">
                Mapa próximamente
              </span>
            </div>
          </div>

          {/* Participantes */}
          <button
            onClick={() => alert('Abriendo lista de participantes...')}
            className="flex items-center gap-4 w-full pt-2 hover:bg-muted/30 -mx-6 px-6 md:-mx-8 md:px-8 py-4 rounded-xl transition-colors"
          >
            <Users className="w-6 h-6 text-accent flex-shrink-0" />
            <div className="text-left">
              <p className="font-semibold">Participantes</p>
              <p className="text-sm text-muted-foreground">
                {event.participants} personas asistirán
              </p>
            </div>
          </button>
        </div>

        {/* Descripción */}
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-3">Sobre este evento</h3>
          <p className="text-muted-foreground leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Sección de CTA o Calificación */}
        {!isFinished ? (
          /* Botón de Unirse (evento activo) */
          <Button
            onClick={handleJoin}
            className="w-full md:max-w-md md:mx-auto md:block h-14 text-base rounded-xl shadow-lg hover:shadow-xl"
            size="lg"
          >
            Unirse al Evento
          </Button>
        ) : (
          <>
            {/* Sección de Calificación (evento finalizado) */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-md mb-8 max-w-md mx-auto">
              <h3 className="font-semibold text-lg mb-6">Califica este Evento</h3>
              <div className="flex flex-col items-center gap-6">
                <StarRating value={rating} onChange={setRating} />
                <Button
                  onClick={handleRatingSubmit}
                  disabled={rating === 0}
                  className="w-full h-14 text-base rounded-xl"
                >
                  Enviar Calificación
                </Button>
              </div>
            </div>

            {/* Sección de Memorias */}
            {event.memories && event.memories.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Memorias del Evento</h3>
                  <span className="text-sm text-muted-foreground">
                    {event.memories.length} fotos
                  </span>
                </div>

                {/* Grid de fotos responsive */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.memories.map((photo, index) => (
                    <div
                      key={index}
                      className="relative rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-shadow"
                    >
                      <img
                        src={photo}
                        alt={`Memoria ${index + 1}`}
                        className="w-full h-auto object-cover"
                      />
                      {/* Badge de destacado */}
                      {event.featuredMemory === index && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-yellow-500 text-white flex items-center gap-1.5 px-3 py-1.5 shadow-lg">
                            <Star className="w-4 h-4 fill-white" />
                            Destacada
                          </Badge>
                        </div>
                      )}
                      {/* Botón de eliminar (aparece al hover) */}
                      <button
                        onClick={() => handleDeleteMemory(index)}
                        className="absolute top-3 right-3 bg-destructive text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
                        aria-label="Eliminar memoria"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
