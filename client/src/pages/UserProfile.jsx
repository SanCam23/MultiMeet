import { useState } from 'react'
import { ArrowLeft, MapPin, UserPlus, UserCheck, CalendarDays, Users } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs'
import { Avatar, AvatarFallback } from '../components/ui/Avatar'
import { EventCard } from '../components/EventCard'
import { BottomNav } from '../components/BottomNav'
import { useTheme } from '../context/ThemeContext'

const mockPublicUsers = {
    'carlos-ruiz': {
        name: 'Carlos Ruiz', username: '@carlosruiz',
        bio: 'Organizador de eventos tech en San Francisco. Apasionado por la innovación, las startups y crear conexiones que importan.',
        initials: 'CR', avatarColor: '#7209B7', location: 'San Francisco, CA',
        followers: 284, following: 96,
        eventsCreated: [
            { id: '1', image: 'https://images.unsplash.com/photo-1760642626994-8ebd037f78dc?w=400', title: 'Tech Networking Night', date: 'Feb 15, 2026', time: '7:00 PM', location: 'Downtown Tech Hub, San Francisco', participants: 45, category: 'Tech', isTrending: true },
            { id: 's-tech-2', image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400', title: 'AI & Machine Learning Meetup', date: 'Feb 22, 2026', time: '6:30 PM', location: 'Innovation Hub, Palo Alto', participants: 60, category: 'Tech' },
        ],
    },
    'laura-gomez': {
        name: 'Laura Gómez', username: '@lauragomez',
        bio: 'Música en vena, festivales en el corazón. Organizadora de eventos culturales y amante de la vida en directo.',
        initials: 'LG', avatarColor: '#9263F8', location: 'Oakland, CA', followers: 512, following: 210,
        eventsCreated: [
            { id: 'finished-1', image: 'https://images.unsplash.com/photo-1672841821756-fc04525771c2?w=400', title: 'Summer Music Fest 2025', date: 'Aug 10, 2025', time: '4:00 PM', location: 'Golden Gate Park, San Francisco', participants: 156, category: 'Music' },
            { id: 's-music-2', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400', title: 'Jazz Night at the Harbor', date: 'Feb 27, 2026', time: '8:00 PM', location: 'Pier 39, San Francisco', participants: 75, category: 'Music' },
        ],
    },
    'coachella-official': {
        name: 'Coachella Official', username: '@coachellaofficial',
        bio: 'El festival de música y artes más icónico del mundo. Indio, California.',
        initials: 'CO', avatarColor: '#7209B7', location: 'Indio, California', followers: 4200000, following: 12,
        eventsCreated: [
            { id: 'global-1', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400', title: 'Coachella Valley Music Festival 2026', date: 'Apr 10-12, 2026', time: '12:00 PM', location: 'Empire Polo Club, Indio, California', participants: 125000, category: 'Music', isTrending: true },
        ],
    },
    'ana-torres': {
        name: 'Ana Torres', username: '@anatorres',
        bio: 'Organizadora de eventos sociales y comunitarios en la Bahía de SF.',
        initials: 'AT', avatarColor: '#7209B7', location: 'Oakland, CA', followers: 198, following: 143,
        eventsCreated: [
            { id: '2', image: 'https://images.unsplash.com/photo-1759074037385-0ad31887b14f?w=400', title: 'Coffee & Conversation Morning', date: 'Feb 14, 2026', time: '9:00 AM', location: 'Blue Bottle Coffee, Oakland', participants: 12, category: 'Social' },
        ],
    },
    'miguel-santos': {
        name: 'Miguel Santos', username: '@miguelsantos',
        bio: 'Instructor de yoga certificado y runner apasionado.',
        initials: 'MS', avatarColor: '#7CCFEB', location: 'San Francisco, CA', followers: 421, following: 87,
        eventsCreated: [
            { id: '3', image: 'https://images.unsplash.com/photo-1644612105654-b6b0a941ecde?w=400', title: 'Sunrise Yoga Session', date: 'Feb 16, 2026', time: '6:30 AM', location: 'Golden Gate Park', participants: 28, category: 'Fitness' },
        ],
    },
    'david-chen': {
        name: 'David Chen', username: '@davidchen',
        bio: 'Aventurero urbano y amante del aire libre.',
        initials: 'DC', avatarColor: '#7209B7', location: 'Mill Valley, CA', followers: 317, following: 204,
        eventsCreated: [
            { id: '5', image: 'https://images.unsplash.com/photo-1770564512491-e88eb93d48a3?w=400', title: 'Weekend Hiking Adventure', date: 'Feb 18, 2026', time: '8:00 AM', location: 'Mount Tamalpais Trailhead', participants: 34, category: 'Outdoor', isTrending: true },
        ],
    },
    'sofia-rossi': {
        name: 'Sofia Rossi', username: '@sofiarossi',
        bio: 'Chef italiana apasionada y guía gastronómica.',
        initials: 'SR', avatarColor: '#9263F8', location: 'Berkeley, CA', followers: 563, following: 172,
        eventsCreated: [
            { id: '6', image: 'https://images.unsplash.com/photo-1762994576926-b8268190a2c9?w=400', title: 'Italian Cooking Workshop', date: 'Feb 17, 2026', time: '6:00 PM', location: 'Culinary Institute, Berkeley', participants: 20, category: 'Food' },
        ],
    },
    'sarah-johnson': {
        name: 'Sarah Johnson', username: '@sarahj',
        bio: 'Tech enthusiast | Coffee lover | Always up for a good meetup.',
        initials: 'SJ', avatarColor: '#7209B7', location: 'San Francisco, CA', followers: 342, following: 128,
        eventsCreated: [
            { id: 'p1', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', title: 'Weekly Book Club', date: 'Feb 22, 2026', time: '6:00 PM', location: 'Local Library, SF', participants: 8, category: 'Books' },
        ],
    },
}

function formatCount(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M'
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'K'
    return String(n)
}

/**
 * UserProfile - Página de perfil público de otro usuario
 * Muestra información del usuario, botón de seguir y eventos creados
 */
export default function UserProfile() {
    const { username } = useParams()
    const navigate = useNavigate()
    const [isFollowing, setIsFollowing] = useState(false)
    const { theme } = useTheme()
    const isHighContrast = theme === 'high-contrast'

    const user = username ? mockPublicUsers[username] : null

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <Users className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold">Usuario no encontrado</h2>
                <p className="text-muted-foreground text-sm text-center">
                    Este perfil no existe o no está disponible.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-2 text-primary font-medium text-sm hover:underline"
                >
                    Volver atrás
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pb-20 md:pb-0">
            {/* Header bar */}
            <div className="sticky top-0 z-20 bg-card border-b border-border">
                <div className="w-full mx-auto px-4 md:px-8 lg:px-12 max-w-[1440px] h-16 flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <span className="font-semibold truncate">{user.name}</span>
                </div>
            </div>

            {/* Profile Header */}
            <div className="bg-card border-b border-border">
                <div className="w-full mx-auto px-6 md:px-8 lg:px-12 py-8 max-w-[1440px]">
                    <div className="max-w-2xl mx-auto lg:mx-0">
                        <div className="flex items-start justify-between gap-4 mb-5">
                            <Avatar className="w-24 h-24 border-4 border-border flex-shrink-0">
                                <AvatarFallback
                                    className="text-white text-2xl font-bold"
                                    style={{ backgroundColor: user.avatarColor }}
                                >
                                    {user.initials}
                                </AvatarFallback>
                            </Avatar>

                            <button
                                onClick={() => setIsFollowing((f) => !f)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-colors mt-1 flex-shrink-0 ${isFollowing
                                        ? isHighContrast
                                            ? 'bg-yellow-400 text-black'
                                            : 'bg-primary/10 text-primary border border-primary/30'
                                        : isHighContrast
                                            ? 'bg-yellow-400 text-black'
                                            : 'bg-primary text-white'
                                    }`}
                            >
                                {isFollowing ? (
                                    <>
                                        <UserCheck className="w-4 h-4" />
                                        Siguiendo
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4" />
                                        Seguir
                                    </>
                                )}
                            </button>
                        </div>

                        <h2 className="text-xl font-bold mb-0.5">{user.name}</h2>
                        <p className="text-muted-foreground text-sm mb-3">{user.username}</p>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                            <span>{user.location}</span>
                        </div>

                        <p className="text-sm leading-relaxed mb-6">{user.bio}</p>

                        <div className="flex gap-8">
                            <div className="text-center">
                                <p className="text-xl font-bold text-foreground">{formatCount(user.followers)}</p>
                                <p className="text-sm text-muted-foreground">Seguidores</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-foreground">{formatCount(user.following)}</p>
                                <p className="text-sm text-muted-foreground">Siguiendo</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-foreground">{user.eventsCreated.length}</p>
                                <p className="text-sm text-muted-foreground">Eventos</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Events */}
            <div className="w-full mx-auto px-6 md:px-8 lg:px-12 pt-6 pb-8 max-w-[1440px]">
                <Tabs defaultValue="events">
                    <div className="max-w-xs mb-8">
                        <TabsList className="grid w-full grid-cols-1 h-12 bg-card rounded-xl p-1">
                            <TabsTrigger
                                value="events"
                                className={`rounded-lg flex items-center gap-2 data-[state=active]:bg-primary ${isHighContrast ? 'data-[state=active]:text-black' : 'data-[state=active]:text-white'
                                    }`}
                            >
                                <CalendarDays className="w-4 h-4" />
                                Eventos creados
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="events" className="mt-0">
                        {user.eventsCreated.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                                    <CalendarDays className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground text-sm">
                                    Este usuario aún no ha creado ningún evento.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8">
                                {user.eventsCreated.map((event) => (
                                    <EventCard key={event.id} {...event} />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            <BottomNav />
        </div>
    )
}
