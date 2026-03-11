import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, Users, Star, Trash2, Share2, Upload, Video, Image, UserPlus, UserCheck } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Avatar, AvatarFallback } from '../components/ui/Avatar'
import { StarRating } from '../components/StarRating'
import { PreviousEditions } from '../components/PreviousEditions'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

/**
 * Autor y datos mock del evento
 */
const mockAuthors = {
  'carlos-ruiz': { name: 'Carlos Ruiz', initials: 'CR', color: '#7209B7' },
  'laura-gomez': { name: 'Laura Gómez', initials: 'LG', color: '#9263F8' },
  'ana-torres': { name: 'Ana Torres', initials: 'AT', color: '#7209B7' },
  'miguel-santos': { name: 'Miguel Santos', initials: 'MS', color: '#7CCFEB' },
  'david-chen': { name: 'David Chen', initials: 'DC', color: '#7209B7' },
  'sofia-rossi': { name: 'Sofia Rossi', initials: 'SR', color: '#9263F8' },
}

const mockEventData = {
  '1': {
    status: 'active',
    image: 'https://images.unsplash.com/photo-1760642626994-8ebd037f78dc?w=1200&h=600&fit=crop',
    title: 'Tech Networking Night',
    date: 'Feb 15, 2026',
    time: '7:00 PM',
    location: 'Downtown Tech Hub, San Francisco, CA 94105',
    participants: 45,
    categories: ['Tech', 'Networking', 'Professional'],
    description: 'Join us for an evening of networking with tech professionals. Share ideas, make connections, and explore collaboration opportunities in a relaxed and friendly atmosphere. Appetizers and drinks provided.',
    author: 'carlos-ruiz',
    userGallery: [],
    previousEditions: [
      { id: 'pe-1', year: '2025', image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400', title: 'Tech Networking Night 2025', date: 'Feb 12, 2025', participants: 38 },
      { id: 'pe-2', year: '2024', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400', title: 'Tech Networking Night 2024', date: 'Feb 15, 2024', participants: 25 },
    ],
  },
  '2': {
    status: 'active',
    image: 'https://images.unsplash.com/photo-1759074037385-0ad31887b14f?w=1200&h=600&fit=crop',
    title: 'Coffee & Conversation Morning',
    date: 'Feb 14, 2026',
    time: '9:00 AM',
    location: 'Blue Bottle Coffee, Oakland, CA 94612',
    participants: 12,
    categories: ['Social', 'Casual'],
    description: 'Start your day with great conversation and quality coffee. An informal space to meet new people, share experiences, and build new friendships.',
    author: 'ana-torres',
    userGallery: [],
    previousEditions: [],
  },
  '3': {
    status: 'active',
    image: 'https://images.unsplash.com/photo-1644612105654-b6b0a941ecde?w=1200&h=600&fit=crop',
    title: 'Sunrise Yoga Session',
    date: 'Feb 16, 2026',
    time: '6:30 AM',
    location: 'Golden Gate Park, San Francisco, CA',
    participants: 28,
    categories: ['Fitness', 'Outdoor'],
    description: 'Start your day with a mindful yoga session surrounded by nature. All levels welcome.',
    author: 'miguel-santos',
    userGallery: [],
    previousEditions: [],
  },
  '4': {
    status: 'finished',
    image: 'https://images.unsplash.com/photo-1672841821756-fc04525771c2?w=1200&h=600&fit=crop',
    title: 'Indie Music Festival',
    date: 'Aug 10, 2025',
    time: '5:00 PM',
    location: 'The Fillmore, San Francisco',
    participants: 156,
    categories: ['Music', 'Festival', 'Outdoor'],
    description: 'An incredible day of live music with local and international artists.',
    author: 'laura-gomez',
    memories: [
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=900&fit=crop',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=700&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=500&fit=crop',
    ],
    featuredMemory: 0,
    userGallery: [
      { id: 'ug-1', type: 'image', url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400', username: 'elena_m', uploadedAt: 'Aug 11, 2025' },
      { id: 'ug-2', type: 'video', url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400', username: 'alex_j', uploadedAt: 'Aug 11, 2025' },
      { id: 'ug-3', type: 'image', url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400', username: 'marta_r', uploadedAt: 'Aug 12, 2025' },
    ],
    previousEditions: [
      { id: 'pe-music-1', year: '2024', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400', title: 'Indie Music Fest 2024', date: 'Aug 15, 2024', participants: 120 },
    ],
  },
  '5': {
    status: 'active',
    image: 'https://images.unsplash.com/photo-1770564512491-e88eb93d48a3?w=1200&h=600&fit=crop',
    title: 'Weekend Hiking Adventure',
    date: 'Feb 18, 2026',
    time: '8:00 AM',
    location: 'Mount Tamalpais Trailhead, Mill Valley, CA',
    participants: 34,
    categories: ['Outdoor', 'Fitness'],
    description: 'Explore beautiful trails and enjoy stunning views. Moderate difficulty, all levels welcome.',
    author: 'david-chen',
    userGallery: [],
    previousEditions: [],
  },
  '6': {
    status: 'active',
    image: 'https://images.unsplash.com/photo-1762994576926-b8268190a2c9?w=1200&h=600&fit=crop',
    title: 'Italian Cooking Workshop',
    date: 'Feb 17, 2026',
    time: '6:00 PM',
    location: 'Culinary Institute, Berkeley, CA',
    participants: 20,
    categories: ['Food', 'Social'],
    description: 'Learn to cook authentic Italian dishes from a professional chef. Materials included.',
    author: 'sofia-rossi',
    userGallery: [],
    previousEditions: [],
  },
}

/**
 * ItemDetail - Página de detalle de evento
 * Muestra información completa, autor, galería de participantes, ediciones anteriores
 */
export default function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
  const [activeTab, setActiveTab] = useState('gallery')
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false)
  const { theme } = useTheme()
  const isHighContrast = theme === 'high-contrast'

  const event = mockEventData[id] || mockEventData['1']
  const isFinished = event.status === 'finished'
  const author = event.author ? mockAuthors[event.author] : null

  const hasGallery = event.userGallery && event.userGallery.length > 0
  const hasEditions = event.previousEditions && event.previousEditions.length > 0
  const hasBothSections = hasGallery && hasEditions

  const handleJoin = () => alert('¡Te has unido al evento!')
  const handleRatingSubmit = () => {
    if (rating > 0) alert(`¡Gracias por calificar con ${rating} estrellas!`)
  }
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event.title, text: event.description, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('¡Link copiado al portapapeles!')
    }
  }
  const handleUploadMedia = () => alert('Abriendo selector de archivos...')

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-72 md:h-96 lg:h-[28rem]">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-card rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          aria-label="Volver"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <button
          onClick={handleShare}
          className="absolute top-6 right-6 bg-card rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          aria-label="Compartir"
        >
          <Share2 className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="w-full mx-auto px-6 md:px-8 lg:px-12 py-8 max-w-[1000px]">
        {/* Title & Categories */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-foreground">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {event.categories.map((cat) => (
              <Badge key={cat} className="bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm">
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Author Row */}
        {author && (
          <div className="flex items-center justify-between mb-8 p-4 bg-card rounded-2xl border border-border">
            <Link to={`/user/${event.author}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="text-white font-bold" style={{ backgroundColor: author.color }}>
                  {author.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{author.name}</p>
                <p className="text-xs text-muted-foreground">Organizador</p>
              </div>
            </Link>
            <button
              onClick={() => setIsFollowingAuthor((f) => !f)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${isFollowingAuthor
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'bg-primary text-white'
                }`}
            >
              {isFollowingAuthor ? (
                <><UserCheck className="w-4 h-4" /> Siguiendo</>
              ) : (
                <><UserPlus className="w-4 h-4" /> Seguir</>
              )}
            </button>
          </div>
        )}

        {/* Event Info Card */}
        <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-md space-y-6 mb-8">
          <div className="flex items-start gap-4">
            <Calendar className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-1">Fecha y hora</p>
              <p className="text-sm text-muted-foreground">{event.date} a las {event.time}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-secondary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold mb-1">Ubicación</p>
              <p className="text-sm text-muted-foreground">{event.location}</p>
            </div>
          </div>

          <div className="h-40 md:h-48 bg-muted rounded-xl overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-secondary/40" />
            </div>
          </div>

          <button
            onClick={() => alert('Abriendo lista de participantes...')}
            className="flex items-center gap-4 w-full pt-2 hover:bg-muted/30 -mx-6 px-6 md:-mx-8 md:px-8 py-4 rounded-xl transition-colors"
          >
            <Users className="w-6 h-6 text-accent flex-shrink-0" />
            <div className="text-left">
              <p className="font-semibold">Participantes</p>
              <p className="text-sm text-muted-foreground">{event.participants} personas apuntadas</p>
            </div>
          </button>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-3">Sobre este evento</h3>
          <p className="text-muted-foreground leading-relaxed">{event.description}</p>
        </div>

        {/* CTA or Rating Section */}
        {!isFinished ? (
          <Button onClick={handleJoin} className="w-full md:max-w-md md:mx-auto md:block h-14 text-base rounded-xl shadow-lg mb-8" size="lg">
            Unirse al evento
          </Button>
        ) : (
          <>
            {/* Rating Section */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-md mb-8 max-w-md mx-auto">
              <h3 className="font-semibold text-lg mb-6">Valora este evento</h3>
              <div className="flex flex-col items-center gap-6">
                <StarRating value={rating} onChange={setRating} />
                <Button onClick={handleRatingSubmit} disabled={rating === 0} className="w-full h-14 text-base rounded-xl">
                  Enviar valoración
                </Button>
              </div>
            </div>

            {/* Memories Section */}
            {event.memories && event.memories.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Recuerdos del evento</h3>
                  <span className="text-sm text-muted-foreground">{event.memories.length} fotos</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.memories.map((photo, index) => (
                    <div key={index} className="relative rounded-2xl overflow-hidden group shadow-md">
                      <img src={photo} alt={`Memory ${index + 1}`} className="w-full h-auto" />
                      {event.featuredMemory === index && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-yellow-500 text-white flex items-center gap-1.5 px-3 py-1.5">
                            <Star className="w-4 h-4 fill-white" />
                            Destacado
                          </Badge>
                        </div>
                      )}
                      <button className="absolute top-3 right-3 bg-destructive text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Combined Section with Tabs (when both exist) or Individual Sections */}
        {hasBothSections ? (
          <div className="mb-8">
            <div className="flex gap-3 mb-6 border-b border-border">
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-6 py-3 font-medium text-base rounded-t-lg transition-colors ${activeTab === 'gallery'
                    ? `bg-primary ${isHighContrast ? 'text-black' : 'text-white'}`
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  }`}
              >
                Galería de participantes
              </button>
              <button
                onClick={() => setActiveTab('editions')}
                className={`px-6 py-3 font-medium text-base rounded-t-lg transition-colors ${activeTab === 'editions'
                    ? `bg-primary ${isHighContrast ? 'text-black' : 'text-white'}`
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  }`}
              >
                Ediciones anteriores
              </button>
            </div>

            {activeTab === 'gallery' ? (
              <GallerySection gallery={event.userGallery} onUpload={handleUploadMedia} />
            ) : (
              <PreviousEditions editions={event.previousEditions} />
            )}
          </div>
        ) : (
          <>
            {hasGallery && (
              <div className="mb-8">
                <GallerySection gallery={event.userGallery} onUpload={handleUploadMedia} />
              </div>
            )}
            {hasEditions && (
              <PreviousEditions editions={event.previousEditions} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function GallerySection({ gallery, onUpload }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">Compartido por participantes</h3>
        <span className="text-sm text-muted-foreground">{gallery.length} elementos</span>
      </div>
      <div className="mb-6">
        <Button onClick={onUpload} variant="outline" className="w-full md:w-auto h-12 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors">
          <Upload className="w-5 h-5 mr-2" />
          Subir fotos y vídeos
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map((item) => (
          <div key={item.id} className="relative rounded-2xl overflow-hidden group shadow-md bg-card border border-border">
            <div className="relative">
              <img src={item.url} alt={`Upload by ${item.username}`} className="w-full h-auto" />
              {item.type === 'video' && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-3">
                    <Video className="w-6 h-6 text-primary" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{item.username}</p>
                  <p className="text-xs text-muted-foreground">{item.uploadedAt}</p>
                </div>
                {item.type === 'image' && <Image className="w-4 h-4 text-muted-foreground" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
