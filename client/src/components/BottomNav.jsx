import { Home, Search, PlusCircle, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

/**
 * BottomNav - Navegación inferior para móviles
 * Componente reutilizable para navegación en dispositivos móviles
 * Se oculta automáticamente en pantallas medianas y grandes (md:hidden)
 */
export function BottomNav() {
  const location = useLocation()

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Inicio',
    },
    {
      path: '/categories',
      icon: Search,
      label: 'Buscar',
    },
    {
      path: '/upload',
      icon: PlusCircle,
      label: 'Crear',
    },
    {
      path: '/profile',
      icon: User,
      label: 'Perfil',
    },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 shadow-lg">
      <div className="flex items-center justify-around px-4 py-3 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
                }`}
            >
              <Icon
                className={`w-6 h-6 ${isActive ? 'fill-primary/20' : ''}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
