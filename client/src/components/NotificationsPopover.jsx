import { useState } from 'react'
import { Bell, UserPlus, Calendar, MapPin, Star, MessageCircle } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/Popover'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { ScrollArea } from './ui/ScrollArea'
import { Separator } from './ui/Separator'
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar'

const mockNotifications = [
    {
        id: '1',
        type: 'follow',
        title: 'Nuevo Seguidor',
        message: 'Sarah Chen empezó a seguirte',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isRead: false,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    {
        id: '2',
        type: 'event',
        title: 'Evento próximo',
        message: 'Noche de Networking Tecnológico empieza en 2 horas',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isRead: false,
    },
    {
        id: '3',
        type: 'comment',
        title: 'Nuevo Comentario',
        message: 'Alex Johnson comentó en tu evento',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        isRead: false,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    },
    {
        id: '4',
        type: 'rating',
        title: 'Nueva Valoración',
        message: 'Tu evento "Café Matutino" recibió 5 estrellas',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        isRead: false,
    },
    {
        id: '5',
        type: 'reminder',
        title: 'Evento Mañana',
        message: 'Sesión de Yoga al Amanecer es mañana a las 6:30',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        isRead: false,
    },
]

const getNotificationIcon = (type) => {
    switch (type) {
        case 'follow':
            return <UserPlus className="w-4 h-4" />
        case 'event':
            return <Calendar className="w-4 h-4" />
        case 'comment':
            return <MessageCircle className="w-4 h-4" />
        case 'rating':
            return <Star className="w-4 h-4" />
        case 'reminder':
            return <MapPin className="w-4 h-4" />
        default:
            return <Bell className="w-4 h-4" />
    }
}

const getNotificationColor = (type) => {
    switch (type) {
        case 'follow':
            return 'bg-accent text-accent-foreground'
        case 'event':
            return 'bg-primary text-primary-foreground'
        case 'comment':
            return 'bg-secondary text-secondary-foreground'
        case 'rating':
            return 'bg-yellow-500 text-white'
        case 'reminder':
            return 'bg-muted text-muted-foreground'
        default:
            return 'bg-muted text-muted-foreground'
    }
}

const getRelativeTime = (date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Ahora'
    if (minutes < 60) return `hace ${minutes}m`
    if (hours < 24) return `hace ${hours}h`
    if (days < 7) return `hace ${days}d`
    return date.toLocaleDateString()
}

export function NotificationsPopover() {
    const [notifications, setNotifications] = useState(mockNotifications)

    const unreadCount = notifications.filter((n) => !n.isRead).length

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        )
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id))
        }, 300)
    }

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        setTimeout(() => {
            setNotifications([])
        }, 300)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="relative p-2 hover:bg-muted/50 rounded-full transition-colors group">
                    <Bell className="w-6 h-6 text-secondary group-hover:text-primary transition-colors" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary rounded-full text-white text-xs font-semibold flex items-center justify-center shadow-lg animate-pulse">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[380px] md:w-[420px] p-0 rounded-2xl shadow-2xl border-border"
                align="end"
                sideOffset={8}
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">Notificaciones</h3>
                            {unreadCount > 0 && (
                                <Badge className="bg-primary text-white h-6 px-2 rounded-full">
                                    {unreadCount}
                                </Badge>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={markAllAsRead}
                                className="text-primary hover:text-primary hover:bg-primary/10 h-8 px-3 rounded-lg"
                            >
                                Leer todo
                            </Button>
                        )}
                    </div>
                </div>

                {/* Lista de notificaciones */}
                {notifications.length === 0 ? (
                    <div className="py-10 sm:py-16 px-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                            <Bell className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="font-medium text-foreground mb-1">
                            ¡Todo al día!
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Has leído todas tus notificaciones
                        </p>
                    </div>
                ) : (
                    <ScrollArea className="max-h-[60vh] sm:h-[400px]">
                        <div className="py-2">
                            {notifications.map((notification, index) => (
                                <div key={notification.id}>
                                    <div
                                        className={`px-6 py-4 hover:bg-muted/30 transition-all cursor-pointer relative ${!notification.isRead ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                                            }`}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <div className="flex gap-4">
                                            {/* Icono o Avatar */}
                                            <div className="flex-shrink-0">
                                                {notification.avatar ? (
                                                    <Avatar className="w-11 h-11 ring-2 ring-offset-2 ring-offset-background ring-transparent hover:ring-primary/20 transition-all">
                                                        <AvatarImage src={notification.avatar} />
                                                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                                                            {notification.title[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                ) : (
                                                    <div
                                                        className={`w-11 h-11 rounded-full flex items-center justify-center shadow-sm ${getNotificationColor(
                                                            notification.type
                                                        )}`}
                                                    >
                                                        {getNotificationIcon(notification.type)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Contenido */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h4 className="font-semibold text-sm">{notification.title}</h4>
                                                    {!notification.isRead && (
                                                        <div className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0 mt-1 animate-pulse"></div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-muted-foreground/80">
                                                    {getRelativeTime(notification.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {index < notifications.length - 1 && (
                                        <Separator className="mx-6" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </PopoverContent>
        </Popover>
    )
}
