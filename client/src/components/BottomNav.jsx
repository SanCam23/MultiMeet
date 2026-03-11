import { Home, Search, PlusCircle, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export function BottomNav() {
  const location = useLocation()

  const navItems = [
    { icon: Home, label: 'Inicio', path: '/' },
    { icon: Search, label: 'Buscar', path: '/search' },
    { icon: PlusCircle, label: 'Crear', path: '/create', isPrimary: true },
    { icon: User, label: 'Perfil', path: '/profile' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around px-8 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          if (item.isPrimary) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-14 h-14 -mt-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <span className="text-xs text-primary font-medium mt-1">
                  {item.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1.5"
            >
              <Icon
                className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
              />
              <span
                className={`text-xs ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
