import { Bell, User, Home, Search, PlusCircle } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

/**
 * TopAppBar - Barra de navegación superior
 * Componente reutilizable para la navegación principal de la aplicación
 */
export function TopAppBar() {
  const location = useLocation()

  return (
    <div className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="w-full mx-auto max-w-[1440px]">
        <div className="px-6 md:px-8 lg:px-12 py-5 flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground hidden sm:block">
                MultiMeet
              </h1>
            </Link>
          </div>

          {/* Navegación desktop - Oculta en móvil */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/'
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Inicio</span>
            </Link>
            
            <Link
              to="/categories"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/categories'
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
            <button 
              className="relative p-2 hover:bg-muted/50 rounded-full transition-colors"
              aria-label="Notificaciones"
            >
              <Bell className="w-6 h-6 text-secondary" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            
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
