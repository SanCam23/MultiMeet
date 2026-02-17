import { User, Home, Search, PlusCircle } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { NotificationsPopover } from './NotificationsPopover'
import logoPng from '../assets/logo.png'

/**
 * TopAppBar - Barra de navegación superior
 * Componente reutilizable para la navegación principal de la aplicación
 */
export function TopAppBar() {
  const location = useLocation()

  return (
    <div className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="w-full mx-auto max-w-[1440px]">
        <div className="px-6 md:px-8 lg:px-12 py-5 flex items-center justify-between relative">
          {/* Logo y título */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img
                src={logoPng}
                alt="MultiMeet Logo"
                className="w-20 h-20"
                width={40}
                height={40}
              />
              <h1 className="font-logo text-xl lg:text-2xl xl:text-3xl font-semibold text-primary md:hidden lg:block">
                MultiMeet.
              </h1>
            </Link>
          </div>

          {/* Navegación desktop - Centrada con posición absoluta */}
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${location.pathname === '/'
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Inicio</span>
            </Link>

            <Link
              to="/categories"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${location.pathname === '/categories'
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
            >
              <Search className="w-5 h-5" />
              <span className="font-medium">Explorar</span>
            </Link>

            <Link
              to="/upload"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="font-medium">Crear</span>
            </Link>
          </nav>

          {/* Acciones del usuario */}
          <div className="flex items-center gap-4">
            {/* Notificaciones */}
            <NotificationsPopover />

            {/* Perfil */}
            <Link
              to="/profile"
              className="p-2 hover:bg-muted/50 rounded-full transition-colors"
              aria-label="Perfil"
            >
              <User className="w-6 h-6 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
