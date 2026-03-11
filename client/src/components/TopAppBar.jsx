import { User, Home, Search, PlusCircle } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { NotificationsPopover } from './NotificationsPopover'
import { useTheme } from '../context/ThemeContext'
import logoImage from '../assets/logo.png'

export function TopAppBar() {
  const location = useLocation()
  const { theme } = useTheme()
  const isHighContrast = theme === 'high-contrast'

  return (
    <div className="bg-background border-b border-border sticky top-0 z-10 shadow-sm">
      <div className="w-full mx-auto max-w-[1440px]">
        <div className="px-6 md:px-8 lg:px-12 py-5 flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img
                src={logoImage}
                alt="MultiMeet Logo"
                className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain"
              />
              <h1 className="font-semibold font-logo text-[26px] md:text-[28px] lg:text-[36px] text-logo-title whitespace-nowrap">
                MultiMeet.
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${location.pathname === '/'
                ? 'text-primary bg-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Inicio</span>
            </Link>
            <Link
              to="/search"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${location.pathname === '/search'
                ? 'text-primary bg-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
            >
              <Search className="w-5 h-5" />
              <span className="font-medium">Buscar</span>
            </Link>
            <Link
              to="/create"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="font-medium">Crear</span>
            </Link>
          </nav>

          <div className="flex items-center gap-4 flex-1 justify-end">
            <NotificationsPopover />
            <Link
              to="/profile"
              className="hidden md:block p-2 hover:bg-muted/50 rounded-full transition-colors"
            >
              <User className={`w-6 h-6 ${isHighContrast ? 'text-yellow-300' : 'text-muted-foreground'}`} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
