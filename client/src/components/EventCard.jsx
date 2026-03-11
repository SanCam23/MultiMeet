import { Calendar, MapPin, Users, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from './ui/Badge'
import { useTheme } from '../context/ThemeContext'

export function EventCard({
  id,
  image,
  title,
  date,
  time,
  location,
  participants,
  category,
  isTrending = false,
}) {
  const { theme } = useTheme()
  const isHighContrast = theme === 'high-contrast'

  return (
    <Link to={`/event/${id}`}>
      <div className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-border">
        <div className="relative h-48">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          {isTrending && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-secondary text-secondary-foreground flex items-center gap-1.5 px-3 py-1.5 shadow-lg">
                <TrendingUp className="w-4 h-4" />
                Tendencia
              </Badge>
            </div>
          )}
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-accent text-accent-foreground backdrop-blur-sm px-3 py-1.5">
              {category}
            </Badge>
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-semibold text-lg mb-4 line-clamp-2">{title}</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <span>
                {date} a las {time}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className={`w-5 h-5 ${isHighContrast ? 'text-yellow-300' : 'text-secondary'}`} />
              <span className="line-clamp-1">{location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-accent" />
              <span>{participants} asistentes</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
