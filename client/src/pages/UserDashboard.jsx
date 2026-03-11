import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { EventCard } from '../components/EventCard'
import { TopAppBar } from '../components/TopAppBar'
import { BottomNav } from '../components/BottomNav'
import { SettingsDialog } from '../components/SettingsDialog'
import { useTheme } from '../context/ThemeContext'

const mockUserData = {
  name: 'Sarah Johnson',
  username: '@sarahj',
  bio: 'Tech enthusiast | Coffee lover | Always up for a good meetup',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  location: 'San Francisco, CA',
  followers: 342,
  following: 128,
}

const mockPersonalEvents = [
  {
    id: 'p1',
    image: 'https://images.unsplash.com/photo-1760642626994-8ebd037f78dc?w=400',
    title: 'Weekly Book Club',
    date: 'Feb 22, 2026',
    time: '6:00 PM',
    location: 'Local Library, SF',
    participants: 8,
    category: 'Books',
  },
]

const mockJoinedEvents = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1760642626994-8ebd037f78dc?w=400',
    title: 'Tech Networking Night',
    date: 'Feb 15, 2026',
    time: '7:00 PM',
    location: 'Downtown Tech Hub',
    participants: 45,
    category: 'Tech',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1644612105654-b6b0a941ecde?w=400',
    title: 'Sunrise Yoga Session',
    date: 'Feb 16, 2026',
    time: '6:30 AM',
    location: 'Golden Gate Park',
    participants: 28,
    category: 'Fitness',
  },
]

const mockPastEvents = [
  {
    id: 'finished-1',
    image: 'https://images.unsplash.com/photo-1672841821756-fc04525771c2?w=400',
    title: 'Summer Music Fest 2025',
    date: 'Aug 10, 2025',
    time: '4:00 PM',
    location: 'Golden Gate Park',
    participants: 156,
    category: 'Music',
  },
]

/**
 * UserDashboard - Página de perfil de usuario propio
 * Muestra perfil, eventos creados, eventos unidos y timeline
 * Con SettingsDialog para cambiar tema y tamaño de texto
 */
export default function UserDashboard() {
  const [postsTab, setPostsTab] = useState('personal')
  const [timelineTab, setTimelineTab] = useState('upcoming')
  const [mainTab, setMainTab] = useState('posts')
  const { theme } = useTheme()
  const isHighContrast = theme === 'high-contrast'

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <TopAppBar />

      {/* Profile Header */}
      <div className="bg-card border-b border-border">
        <div className="w-full mx-auto px-6 md:px-8 lg:px-12 py-8 max-w-[1440px]">
          <div className="max-w-2xl mx-auto lg:mx-0">
            <div className="flex items-start gap-5 mb-6">
              <Avatar className="w-24 h-24 border-4 border-secondary/20">
                <AvatarImage src={mockUserData.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl">
                  SJ
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">{mockUserData.name}</h2>
                <p className="text-muted-foreground text-sm mb-3">
                  {mockUserData.username}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-secondary" />
                  <span>{mockUserData.location}</span>
                </div>
              </div>
            </div>

            <p className="text-sm mb-6 leading-relaxed">{mockUserData.bio}</p>

            <div className="flex gap-8 mb-6">
              <button className="text-center">
                <p className="text-xl font-bold text-foreground">{mockUserData.followers}</p>
                <p className="text-sm text-muted-foreground">Seguidores</p>
              </button>
              <button className="text-center">
                <p className="text-xl font-bold text-foreground">{mockUserData.following}</p>
                <p className="text-sm text-muted-foreground">Siguiendo</p>
              </button>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 md:flex-initial md:px-8 h-12 rounded-xl">
                Editar perfil
              </Button>
              <SettingsDialog />
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="w-full mx-auto px-6 md:px-8 lg:px-12 pt-6 pb-8 max-w-[1440px]">
        <Tabs value={mainTab} onValueChange={setMainTab}>

          {/* Desktop: both tablists inline */}
          <div className="hidden md:flex items-center justify-center gap-6 mb-8">
            <TabsList className="grid grid-cols-2 h-12 bg-card rounded-xl p-1 w-64">
              <TabsTrigger
                value="posts"
                className={`rounded-lg data-[state=active]:bg-primary ${isHighContrast ? 'data-[state=active]:text-black' : 'data-[state=active]:text-white'}`}
              >
                Mis posts
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className={`rounded-lg data-[state=active]:bg-primary ${isHighContrast ? 'data-[state=active]:text-black' : 'data-[state=active]:text-white'}`}
              >
                Historial
              </TabsTrigger>
            </TabsList>

            {mainTab === 'posts' ? (
              <Tabs value={postsTab} onValueChange={setPostsTab}>
                <TabsList className="grid grid-cols-2 h-11 bg-card rounded-lg p-0.5 w-56">
                  <TabsTrigger
                    value="personal"
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-md"
                  >
                    Personal
                  </TabsTrigger>
                  <TabsTrigger
                    value="joined"
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-md"
                  >
                    Apuntado
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            ) : (
              <Tabs value={timelineTab} onValueChange={setTimelineTab}>
                <TabsList className="grid grid-cols-2 h-11 bg-card rounded-lg p-0.5 w-56">
                  <TabsTrigger
                    value="upcoming"
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-md"
                  >
                    Próximos
                  </TabsTrigger>
                  <TabsTrigger
                    value="past"
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-md"
                  >
                    Pasados
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>

          {/* Mobile: main tablist stacked */}
          <div className="md:hidden max-w-md mx-auto mb-2">
            <TabsList className="grid w-full grid-cols-2 h-12 bg-card rounded-xl p-1">
              <TabsTrigger
                value="posts"
                className={`rounded-lg data-[state=active]:bg-primary ${isHighContrast ? 'data-[state=active]:text-black' : 'data-[state=active]:text-white'}`}
              >
                Mis posts
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className={`rounded-lg data-[state=active]:bg-primary ${isHighContrast ? 'data-[state=active]:text-black' : 'data-[state=active]:text-white'}`}
              >
                Historial
              </TabsTrigger>
            </TabsList>
          </div>

          {/* My Posts Tab */}
          <TabsContent value="posts" className="mt-0">
            <Tabs value={postsTab} onValueChange={setPostsTab}>
              <div className="md:hidden max-w-md mx-auto mb-6">
                <TabsList className="grid w-full grid-cols-2 h-11 bg-card rounded-lg p-0.5">
                  <TabsTrigger
                    value="personal"
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-md"
                  >
                    Personal
                  </TabsTrigger>
                  <TabsTrigger
                    value="joined"
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-md"
                  >
                    Apuntado
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="personal" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8 mt-0">
                {mockPersonalEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </TabsContent>

              <TabsContent value="joined" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8 mt-0">
                {mockJoinedEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="mt-0">
            <Tabs value={timelineTab} onValueChange={setTimelineTab}>
              <div className="md:hidden max-w-md mx-auto mb-6">
                <TabsList className="grid w-full grid-cols-2 h-11 bg-card rounded-lg p-0.5">
                  <TabsTrigger
                    value="upcoming"
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-md"
                  >
                    Próximos
                  </TabsTrigger>
                  <TabsTrigger
                    value="past"
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-md"
                  >
                    Pasados
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="upcoming" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8 mt-0">
                {mockJoinedEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </TabsContent>

              <TabsContent value="past" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8 mt-0">
                {mockPastEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  )
}
