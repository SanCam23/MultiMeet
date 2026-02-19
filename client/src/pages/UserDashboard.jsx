import { useState } from 'react'
import { MapPin, Sun, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { EventCard } from '../components/EventCard'
import { TopAppBar } from '../components/TopAppBar'
import { BottomNav } from '../components/BottomNav'
import { useTheme } from '../context/ThemeContext'

/**
 * Datos mock del usuario
 * TODO: Reemplazar con datos reales del backend
 */
const mockUserData = {
  name: 'Sarah Johnson',
  username: '@sarahj',
  bio: 'Entusiasta de la tecnología | Amante del café | Siempre lista para un buen meetup',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  location: 'Madrid, España',
  followers: 342,
  following: 128,
}

/**
 * Eventos creados por el usuario
 */
const mockPersonalEvents = [
  {
    id: 'p1',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
    title: 'Club de Lectura Semanal',
    date: '22 Feb, 2026',
    time: '18:00',
    location: 'Biblioteca Local, Madrid',
    participants: 8,
    category: 'Libros',
  },
  {
    id: 'p2',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
    title: 'Taller de Fotografía',
    date: '25 Feb, 2026',
    time: '16:00',
    location: 'Estudio Creativo, Barcelona',
    participants: 15,
    category: 'Arte',
  },
]

/**
 * Eventos a los que se ha unido el usuario
 */
const mockJoinedEvents = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    title: 'Noche de Networking Tecnológico',
    date: '15 Feb, 2026',
    time: '19:00',
    location: 'Tech Hub Madrid',
    participants: 45,
    category: 'Tech',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    title: 'Sesión de Yoga al Amanecer',
    date: '16 Feb, 2026',
    time: '06:30',
    location: 'Parque del Retiro',
    participants: 28,
    category: 'Fitness',
  },
]

/**
 * Eventos pasados del usuario
 */
const mockPastEvents = [
  {
    id: 'finished-1',
    image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400',
    title: 'Festival de Música de Verano 2025',
    date: '10 Ago, 2025',
    time: '16:00',
    location: 'Parque del Retiro',
    participants: 156,
    category: 'Música',
  },
  {
    id: 'finished-2',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    title: 'Cena Internacional',
    date: '5 Ene, 2026',
    time: '20:30',
    location: 'Restaurante Fusión',
    participants: 24,
    category: 'Comida',
  },
]

/**
 * UserDashboard - Página de perfil de usuario
 * Muestra información del perfil, eventos creados, eventos unidos y timeline
 * 
 * @component
 */
export default function UserDashboard() {
  const [postsTab, setPostsTab] = useState('personal')
  const [timelineTab, setTimelineTab] = useState('upcoming')
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopAppBar />

      {/* Encabezado del perfil */}
      <div className="bg-card border-b border-border">
        <div className="w-full mx-auto px-6 md:px-8 lg:px-12 py-8 max-w-[1440px]">
          <div className="max-w-2xl mx-auto lg:mx-0">
            {/* Avatar y datos básicos */}
            <div className="flex items-start gap-5 mb-6">
              <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-secondary/20">
                <AvatarImage src={mockUserData.avatar} alt={mockUserData.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xl md:text-2xl">
                  SJ
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl md:text-2xl font-bold mb-1 truncate">
                  {mockUserData.name}
                </h2>
                <p className="text-muted-foreground text-sm mb-3">{mockUserData.username}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span className="truncate">{mockUserData.location}</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm mb-6 leading-relaxed text-muted-foreground">
              {mockUserData.bio}
            </p>

            {/* Estadísticas de seguidores */}
            <div className="flex gap-8 mb-6">
              <button className="text-center hover:opacity-70 transition-opacity">
                <p className="text-xl font-bold text-foreground">{mockUserData.followers}</p>
                <p className="text-sm text-muted-foreground">Seguidores</p>
              </button>
              <button className="text-center hover:opacity-70 transition-opacity">
                <p className="text-xl font-bold text-foreground">{mockUserData.following}</p>
                <p className="text-sm text-muted-foreground">Siguiendo</p>
              </button>
            </div>

            {/* Acciones del perfil */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 md:flex-initial md:px-8 h-12 rounded-xl">
                Editar Perfil
              </Button>

              {/* Toggle de tema */}
              <div className="flex border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center justify-center w-12 h-12 transition-all ${theme === 'light'
                    ? 'bg-primary text-white'
                    : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                >
                  <Sun className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center justify-center w-12 h-12 transition-all border-l border-border ${theme === 'dark'
                    ? 'bg-primary text-white'
                    : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                >
                  <Moon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de contenido */}
      <div className="w-full mx-auto px-6 md:px-8 lg:px-12 pt-6 pb-8 max-w-[1440px]">
        <Tabs defaultValue="posts">
          {/* Tabs principales: Mis Posts / Timeline */}
          <div className="max-w-md mx-auto lg:max-w-lg mb-8">
            <TabsList className="grid w-full grid-cols-2 h-12 bg-card rounded-xl p-1">
              <TabsTrigger
                value="posts"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg transition-all"
              >
                Mis Posts
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg transition-all"
              >
                Participados
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab "Mis Posts" */}
          <TabsContent value="posts" className="mt-0">
            <Tabs value={postsTab} onValueChange={setPostsTab}>
              <div className="max-w-md mx-auto lg:max-w-lg mb-6">
                <TabsList className="grid w-full grid-cols-2 h-11 bg-card rounded-lg p-0.5">
                  <TabsTrigger
                    value="personal"
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all"
                  >
                    Personales
                  </TabsTrigger>
                  <TabsTrigger
                    value="joined"
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all"
                  >
                    Inscritos
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Eventos personales (creados por el usuario) */}
              <TabsContent
                value="personal"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8 mt-0"
              >
                {mockPersonalEvents.length > 0 ? (
                  mockPersonalEvents.map((event) => (
                    <Link key={event.id} to={`/event/${event.id}`}>
                      <EventCard {...event} />
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No has creado ningún evento aún</p>
                  </div>
                )}
              </TabsContent>

              {/* Eventos a los que se unió */}
              <TabsContent
                value="joined"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8 mt-0"
              >
                {mockJoinedEvents.length > 0 ? (
                  mockJoinedEvents.map((event) => (
                    <Link key={event.id} to={`/event/${event.id}`}>
                      <EventCard {...event} />
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No te has unido a ningún evento aún</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Tab "Timeline" */}
          <TabsContent value="timeline" className="mt-0">
            <Tabs value={timelineTab} onValueChange={setTimelineTab}>
              <div className="max-w-md mx-auto lg:max-w-lg mb-6">
                <TabsList className="grid w-full grid-cols-2 h-11 bg-card rounded-lg p-0.5">
                  <TabsTrigger
                    value="upcoming"
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all"
                  >
                    Próximos
                  </TabsTrigger>
                  <TabsTrigger
                    value="past"
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all"
                  >
                    Pasados
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Eventos próximos */}
              <TabsContent
                value="upcoming"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8 mt-0"
              >
                {mockJoinedEvents.length > 0 ? (
                  mockJoinedEvents.map((event) => (
                    <Link key={event.id} to={`/event/${event.id}`}>
                      <EventCard {...event} />
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No tienes eventos próximos</p>
                  </div>
                )}
              </TabsContent>

              {/* Eventos pasados */}
              <TabsContent
                value="past"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8 mt-0"
              >
                {mockPastEvents.length > 0 ? (
                  mockPastEvents.map((event) => (
                    <Link key={event.id} to={`/event/${event.id}`}>
                      <EventCard {...event} />
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No tienes eventos pasados</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  )
}
