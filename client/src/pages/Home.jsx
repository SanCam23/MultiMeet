import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs'
import { EventCard } from '../components/EventCard'
import { TopAppBar } from '../components/TopAppBar'
import { BottomNav } from '../components/BottomNav'
import { useTheme } from '../context/ThemeContext'

/**
 * Datos mock para desarrollo
 * TODO: Reemplazar con llamadas a la API cuando el backend esté listo
 */
const mockEvents = {
  following: [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1760642626994-8ebd037f78dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      title: 'Tech Networking Night',
      date: 'Feb 15, 2026',
      time: '7:00 PM',
      location: 'Downtown Tech Hub, San Francisco',
      participants: 45,
      category: 'Tech',
      isTrending: true,
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1759074037385-0ad31887b14f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      title: 'Coffee & Conversation Morning',
      date: 'Feb 14, 2026',
      time: '9:00 AM',
      location: 'Blue Bottle Coffee, Oakland',
      participants: 12,
      category: 'Social',
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1644612105654-b6b0a941ecde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      title: 'Sunrise Yoga Session',
      date: 'Feb 16, 2026',
      time: '6:30 AM',
      location: 'Golden Gate Park',
      participants: 28,
      category: 'Fitness',
    },
  ],
  topInCity: [
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1672841821756-fc04525771c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      title: 'Indie Music Festival',
      date: 'Feb 20, 2026',
      time: '5:00 PM',
      location: 'The Fillmore, San Francisco',
      participants: 156,
      category: 'Music',
      isTrending: true,
    },
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1770564512491-e88eb93d48a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      title: 'Weekend Hiking Adventure',
      date: 'Feb 18, 2026',
      time: '8:00 AM',
      location: 'Mount Tamalpais Trailhead',
      participants: 34,
      category: 'Outdoor',
      isTrending: true,
    },
    {
      id: '6',
      image: 'https://images.unsplash.com/photo-1762994576926-b8268190a2c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      title: 'Italian Cooking Workshop',
      date: 'Feb 17, 2026',
      time: '6:00 PM',
      location: 'Culinary Institute, Berkeley',
      participants: 20,
      category: 'Food',
    },
  ],
  topGlobal: [
    {
      id: 'global-1',
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
      title: 'Coachella Valley Music Festival 2026',
      date: 'Apr 10-12, 2026',
      time: '12:00 PM',
      location: 'Indio, California',
      participants: 125000,
      category: 'Music',
      isTrending: true,
    },
    {
      id: 'global-2',
      image: 'https://images.unsplash.com/photo-1566443280617-35db331c54fb?w=800',
      title: 'Formula 1 Monaco Grand Prix',
      date: 'May 23-25, 2026',
      time: '2:00 PM',
      location: 'Monte Carlo, Monaco',
      participants: 200000,
      category: 'Motorsport',
      isTrending: true,
    },
    {
      id: 'global-3',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
      title: 'Tomorrowland Festival 2026',
      date: 'Jul 17-19, 2026',
      time: '3:00 PM',
      location: 'Boom, Belgium',
      participants: 400000,
      category: 'Music',
      isTrending: true,
    },
    {
      id: 'global-4',
      image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
      title: 'Glastonbury Festival',
      date: 'Jun 24-28, 2026',
      time: '11:00 AM',
      location: 'Pilton, Somerset, UK',
      participants: 210000,
      category: 'Music',
    },
    {
      id: 'global-5',
      image: 'https://images.unsplash.com/photo-1612852098516-55d01c75769a?w=800',
      title: '24 Hours of Le Mans',
      date: 'Jun 13-14, 2026',
      time: '4:00 PM',
      location: 'Le Mans, France',
      participants: 250000,
      category: 'Motorsport',
    },
    {
      id: 'global-6',
      image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
      title: 'Ultra Music Festival Miami',
      date: 'Mar 27-29, 2026',
      time: '1:00 PM',
      location: 'Miami, Florida',
      participants: 165000,
      category: 'Music',
    },
  ],
}

/**
 * Home - Página principal de la aplicación
 * Muestra los eventos en tres pestañas: "Siguiendo", "Top Ciudad" y "Top Global"
 */
export default function Home() {
  const [activeTab, setActiveTab] = useState('following')
  const { theme } = useTheme()
  const isHighContrast = theme === 'high-contrast'

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopAppBar />

      <main className="w-full mx-auto px-6 md:px-8 lg:px-12 pt-6 pb-8 max-w-[1440px]">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="max-w-2xl mx-auto mb-8">
            <TabsList className="grid w-full grid-cols-3 h-12 bg-card rounded-xl p-1">
              <TabsTrigger
                value="following"
                className={`rounded-lg text-sm md:text-base data-[state=active]:bg-primary ${isHighContrast ? 'data-[state=active]:text-black' : 'data-[state=active]:text-white'}`}
              >
                Siguiendo
              </TabsTrigger>
              <TabsTrigger
                value="topInCity"
                className={`rounded-lg text-sm md:text-base data-[state=active]:bg-primary ${isHighContrast ? 'data-[state=active]:text-black' : 'data-[state=active]:text-white'}`}
              >
                Top Ciudad
              </TabsTrigger>
              <TabsTrigger
                value="topGlobal"
                className={`rounded-lg text-sm md:text-base data-[state=active]:bg-primary ${isHighContrast ? 'data-[state=active]:text-black' : 'data-[state=active]:text-white'}`}
              >
                Top Global
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="following" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8 mt-0">
            {mockEvents.following.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </TabsContent>

          <TabsContent value="topInCity" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8 mt-0">
            {mockEvents.topInCity.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </TabsContent>

          <TabsContent value="topGlobal" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8 mt-0">
            {mockEvents.topGlobal.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  )
}
