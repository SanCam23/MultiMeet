import { Calendar, MapPin, Users, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from './ui/Badge'

/**
 * EventCard - Componente reutilizable para mostrar información de un evento
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - ID único del evento
 * @param {string} props.image - URL de la imagen del evento
 * @param {string} props.title - Título del evento
 * @param {string} props.date - Fecha del evento
 * @param {string} props.time - Hora del evento
 * @param {string} props.location - Ubicación del evento
 * @param {number} props.participants - Número de participantes
 * @param {string|string[]} props.category - Categoría del evento (string o array)
 * @param {string[]} props.categories - Alias para categorías (array)
 * @param {boolean} props.isTrending - Si el evento es trending
 */
export function EventCard({
  id,
  image,
  title,
  date,
  time,
  location,
  participants,
  category,
  categories,
  isTrending = false,
}) {
  // Normalizar categorías: soporta tanto 'category' como 'categories'
  const categoryList = categories || (Array.isArray(category) ? category : [category].filter(Boolean))
  const displayCategory = categoryList[0] // Mostrar solo la primera categoría
  return (
    <Link to={`/event/${id}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border group">
        {/* Imagen del evento */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badge de trending */}
          {isTrending && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-secondary text-secondary-foreground flex items-center gap-1.5 shadow-lg">
                <TrendingUp className="w-4 h-4" />
                Trending
              </Badge>
            </div>
          )}
          
          {/* Badge de categoría */}
          <div className="absolute bottom-4 left-4">
            {displayCategory && (
              <Badge variant="accent" className="backdrop-blur-sm bg-accent/90">
                {displayCategory}
              </Badge>
            )}
          </div>
        </div>

        {/* Información del evento */}
        <div className="p-6">
          <h3 className="font-semibold text-lg mb-4 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <div className="space-y-3 text-sm text-muted-foreground">
            {/* Fecha y hora */}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
              <span>
                {date} at {time}
              </span>
            </div>
            
            {/* Ubicación */}
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-secondary flex-shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>
            
            {/* Participantes */}
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-accent flex-shrink-0" />
              <span>{participants} asistiendo</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
