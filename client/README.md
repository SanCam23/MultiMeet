# MultiMeet Client

Frontend de la aplicación MultiMeet construido con React + Vite y Tailwind CSS.

## 🚀 Inicio Rápido

### Instalación
```bash
cd client
npm install
```

### Desarrollo
```bash
npm run dev
```

El servidor de desarrollo estará disponible en `http://localhost:3000`

### Build para producción
```bash
npm run build
npm run preview  # Para previsualizar el build
```

## 📁 Estructura del Proyecto

```
client/
├── src/
│   ├── assets/          # Imágenes, fuentes, etc.
│   ├── components/      # Componentes reutilizables
│   │   ├── ui/         # Componentes UI base (Tabs, Badge, etc.)
│   │   ├── EventCard.jsx
│   │   └── TopAppBar.jsx
│   ├── context/        # Context API de React
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Páginas/Vistas de la aplicación
│   │   ├── Home.jsx
│   │   ├── Auth.jsx
│   │   ├── Categories.jsx
│   │   ├── ItemDetail.jsx
│   │   ├── UploadForm.jsx
│   │   └── UserDashboard.jsx
│   ├── App.jsx         # Componente principal con rutas
│   ├── main.jsx        # Punto de entrada
│   └── index.css       # Estilos globales
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 Sistema de Diseño

### Colores
- **Primary**: `#7209B7` (Púrpura) - Acciones principales
- **Secondary**: `#7CCFEB` (Azul claro) - Acciones secundarias
- **Accent**: `#9263F8` (Púrpura claro) - Acentos y badges
- **Background**: `#F8F9FA` (Gris muy claro)

### Componentes UI Reutilizables

#### Tabs
Componente de pestañas basado en Radix UI:
```jsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@components/ui/Tabs'

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Contenido 1</TabsContent>
  <TabsContent value="tab2">Contenido 2</TabsContent>
</Tabs>
```

#### Badge
Componente para etiquetas y categorías:
```jsx
import { Badge } from '@components/ui/Badge'

<Badge variant="default">Badge</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="accent">Accent</Badge>
```

#### EventCard
Tarjeta para mostrar eventos:
```jsx
import { EventCard } from '@components/EventCard'

<EventCard
  id="1"
  image="https://..."
  title="Evento"
  date="15 Feb, 2026"
  time="19:00"
  location="Madrid"
  participants={45}
  category="Tech"
  isTrending={true}
/>
```

## 🔧 Configuración

### Alias de importación
Configurados en `vite.config.js`:
- `@` → `src/`
- `@components` → `src/components/`
- `@pages` → `src/pages/`
- `@hooks` → `src/hooks/`
- `@context` → `src/context/`
- `@assets` → `src/assets/`

### Proxy API
El servidor de desarrollo hace proxy de `/api` a `http://localhost:5000` para conectar con el backend.

## 📦 Dependencias Principales

- **React 18** - Framework UI
- **React Router DOM** - Enrutamiento
- **Tailwind CSS** - Estilos
- **Radix UI** - Componentes UI accesibles
- **Lucide React** - Iconos
- **Axios** - Cliente HTTP (para API)
- **Vite** - Build tool y dev server

## 🎯 Próximos Pasos

1. **Conectar con el backend**: Descomentar las llamadas a la API en los componentes
2. **Implementar autenticación**: Context API para manejo de usuario
3. **Añadir formularios**: Páginas de Upload y Auth
4. **Optimizar imágenes**: Lazy loading y placeholders
5. **Testing**: Añadir tests unitarios y de integración

## 📝 Notas de Desarrollo

### Datos Mock
Por ahora, la aplicación usa datos mock definidos en cada página. Para conectar con el backend:
1. Descomentar las importaciones de `axios`
2. Descomentar las llamadas a la API en los `useEffect`
3. Ajustar las URLs de los endpoints según el backend

### Componentes Reutilizables
Todos los componentes están diseñados para ser reutilizables. Antes de crear un nuevo componente, verifica si puedes usar o extender uno existente.

### Estilos
Usa las clases de Tailwind y las variables CSS del tema. Evita estilos inline o CSS modules a menos que sea absolutamente necesario.

## 🐛 Debugging

Si encuentras problemas con las rutas o importaciones:
```bash
# Limpia la cache de Vite
rm -rf node_modules/.vite

# Reinstala dependencias
npm install
```
