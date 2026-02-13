import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs'
import { EventCard } from '../components/EventCard'
import { TopAppBar } from '../components/TopAppBar'
import { BottomNav } from '../components/BottomNav'
// import axios from 'axios' // Descomentar cuando se conecte con el backend

/**
 * Datos mock para desarrollo
 * TODO: Reemplazar con llamadas a la API cuando el backend esté listo
 */
const mockEvents = {
  following: [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
      title: 'Noche de Networking Tecnológico',
      date: '15 Feb, 2026',
      time: '19:00',
      location: 'Tech Hub Madrid, Madrid',
      participants: 45,
      category: 'Tecnología',
      isTrending: true,
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop',
      title: 'Café y Conversación Matutina',
      date: '14 Feb, 2026',
      time: '09:00',
      location: 'Café Central, Barcelona',
      participants: 12,
      category: 'Social',
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop',
      title: 'Sesión de Yoga al Amanecer',
      date: '16 Feb, 2026',
      time: '06:30',
      location: 'Parque del Retiro',
      participants: 28,
      category: 'Fitness',
    },
  ],
  topInCity: [
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop',
      title: 'Festival de Música Indie',
      date: '20 Feb, 2026',
      time: '17:00',
      location: 'Sala Apolo, Barcelona',
      participants: 156,
      category: 'Música',
      isTrending: true,
    },
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop',
      title: 'Aventura de Senderismo de Fin de Semana',
      date: '18 Feb, 2026',
      time: '08:00',
      location: 'Sierra de Guadarrama',
      participants: 34,
      category: 'Outdoor',
      isTrending: true,
    },
    {
      id: '6',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop',
      title: 'Taller de Cocina Italiana',
      date: '17 Feb, 2026',
      time: '18:00',
      location: 'Instituto Culinario, Valencia',
      participants: 20,
      category: 'Gastronomía',
    },
  ],
}

/**
 * Home - Página principal de la aplicación
 * Muestra los eventos en dos pestañas: "Siguiendo" y "Top en tu ciudad"
 */
export default function Home() {
  const [activeTab, setActiveTab] = useState('following')
  const [events, setEvents] = useState(mockEvents)
  const [loading, setLoading] = useState(false)

  /**
   * Función para cargar eventos desde el backend
   * TODO: Implementar cuando el endpoint esté disponible
   */
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        // const response = await axios.get('/api/events')
        // setEvents(response.data)
        
        // Por ahora usamos datos mock
        setEvents(mockEvents)
      } catch (error) {
        console.error('Error al cargar eventos:', error)
      } finally {
        setLoading(false)
      }
    }

    // Descomentar cuando el backend esté listo
    // fetchEvents()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Barra de navegación superior */}
      <TopAppBar />

      {/* Contenedor principal con contenido responsive */}
      <main className="w-full mx-auto px-6 md:px-8 lg:px-12 pt-6 pb-24 md:pb-8 max-w-[1440px]">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Pestañas centradas en pantallas grandes */}
          <div className="max-w-md mx-auto lg:max-w-lg mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="following">
                Siguiendo
              </TabsTrigger>
              <TabsTrigger value="topInCity">
                Top en tu Ciudad
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Grid responsive: 1 columna móvil, 2 tablet, 3 desktop */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <TabsContent 
                value="following" 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8 mt-0"
              >
                {events.following.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </TabsContent>

              <TabsContent 
                value="topInCity" 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8 mt-0"
              >
                {events.topInCity.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>

      {/* Navegación inferior para móviles */}
      <BottomNav />
    </div>
  )
}
