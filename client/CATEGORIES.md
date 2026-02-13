# 🔍 Categories (Search/Explore Page) - Documentación

## ✅ Implementación Completada

La página de **búsqueda y exploración** está 100% funcional con filtros avanzados y lista para usar.

## 🎨 Características Implementadas

### 1. **Barra de Búsqueda**
- Input con icono de búsqueda
- Placeholder descriptivo
- Búsqueda en tiempo real (actualiza al escribir)
- Responsive y accesible

### 2. **Filtros Avanzados (Sheet Modal)**
- **Modal desde abajo** con animación suave
- **4 tipos de filtros:**
  - 📍 **Ubicación**: Input de texto para ciudad/dirección
  - 📅 **Rango de fechas**: Dos inputs de tipo date (desde/hasta)
  - 👥 **Mínimo de participantes**: Input numérico
  - 🏷️ **Categorías**: Badges interactivos

- **Botón "Aplicar Filtros"**: Confirma selección
- **Botón cerrar (X)**: En esquina superior derecha
- **Backdrop oscuro**: Click para cerrar

### 3. **Categorías Rápidas**
- **8 categorías** con emojis:
  - 💻 Tech
  - 🎉 Social
  - 💪 Fitness
  - 🎵 Música
  - 🏞️ Naturaleza
  - 🍕 Comida
  - 🎨 Arte
  - 📚 Libros

- Scroll horizontal en móvil
- Selección única (toggle on/off)
- Highlighting visual del seleccionado

### 4. **Resultados de Búsqueda**
- **Estado vacío** con icono y texto motivacional
- **Grid responsive** de eventos (1 col → 2 cols → 3 cols)
- **Contador de resultados**: "X Eventos Encontrados"
- **Badge de categoría activa** en header
- **EventCard reutilizable** con Link a detalle

### 5. **Filtrado Dinámico**
- Filtra por categoría seleccionada
- Actualiza contador automáticamente
- Transiciones suaves

## 🧩 Componentes Creados/Reutilizados

### Nuevos:

#### 1. **Sheet** (`components/ui/Sheet.jsx`)
Modal/Drawer desde abajo con Context API
```jsx
<Sheet>
  <SheetTrigger asChild>
    <Button>Abrir</Button>
  </SheetTrigger>
  <SheetContent side="bottom">
    <SheetHeader>
      <SheetTitle>Título</SheetTitle>
      <SheetDescription>Descripción</SheetDescription>
    </SheetHeader>
    {/* Contenido */}
  </SheetContent>
</Sheet>
```

**Props de SheetContent:**
- `side`: 'bottom', 'top', 'left', 'right'
- `className`: Clases adicionales

**Características:**
- ✅ Backdrop con click-to-close
- ✅ Botón X para cerrar
- ✅ Animaciones CSS (slide-up, fade-in)
- ✅ Bloquea scroll del body
- ✅ Context API para estado compartido

#### 2. **Label** (`components/ui/Label.jsx`)
Etiqueta accesible para formularios
```jsx
<Label htmlFor="email">Email</Label>
<Input id="email" />
```

### Reutilizados:
- ✅ **Input** - Campo de búsqueda y filtros
- ✅ **Button** - Botón de filtros y aplicar
- ✅ **Badge** - Categorías y badges de resultados
- ✅ **EventCard** - Cards de eventos
- ✅ **TopAppBar** - Navegación superior
- ✅ **BottomNav** - Navegación inferior móvil

## 📊 Estructura de Datos

### Categoría
```javascript
{
  name: 'Tech',
  icon: '💻'
}
```

### Evento Mock
```javascript
{
  id: '1',
  image: 'url',
  title: 'Título del evento',
  date: '15 Feb, 2026',
  time: '19:00',
  location: 'Ubicación completa',
  participants: 45,
  categories: ['Tech', 'Social'],
  isTrending: true
}
```

### Filtros
```javascript
{
  location: '',
  dateFrom: '',
  dateTo: '',
  minParticipants: ''
}
```

## 🎯 Responsive Design

### Móvil (< 768px)
- Input full-width
- Categorías con scroll horizontal
- Grid: 1 columna
- Sheet ocupa 85vh
- BottomNav visible

### Tablet (768px - 1024px)
- Input max-width: 3xl
- Grid: 2 columnas
- Sheet centrado con max-width

### Desktop (> 1024px)
- Contenedor max-width: 1440px
- Grid: 3 columnas
- Padding: 48px
- BottomNav oculto

## 🔄 Estados de la Página

### 1. **Inicial** (Sin búsqueda)
```
- showResults: false
- searchQuery: ''
- Muestra: Estado vacío con icono y mensaje
```

### 2. **Búsqueda Activa**
```
- showResults: true
- searchQuery: 'texto'
- Muestra: Grid de resultados filtrados
```

### 3. **Categoría Seleccionada**
```
- selectedCategory: 'Tech'
- Muestra: Solo eventos de esa categoría
- Badge de categoría activa en header
```

## 🎨 Animaciones CSS Añadidas

En `index.css`:

```css
/* Animaciones para Sheet */
@keyframes slide-up { /* Desde abajo */ }
@keyframes slide-down { /* Desde arriba */ }
@keyframes slide-right { /* Desde izquierda */ }
@keyframes slide-left { /* Desde derecha */ }
@keyframes fade-in { /* Backdrop */ }

/* Clases */
.animate-slide-up
.animate-slide-down
.animate-slide-right
.animate-slide-left
.animate-fade-in

/* Scroll horizontal sin barra */
.scrollbar-hide
```

## 🔌 Integración con Backend (TODO)

### Endpoints necesarios:

1. **GET `/api/events/search`** - Búsqueda de eventos
   ```javascript
   params: {
     query: string,
     category: string,
     location: string,
     dateFrom: string,
     dateTo: string,
     minParticipants: number
   }
   ```

2. **GET `/api/events/categories`** - Lista de categorías disponibles

### Cambios necesarios:

```javascript
// En Categories.jsx
import { useState, useEffect } from 'react'
// import axios from 'axios'

const [events, setEvents] = useState([])
const [loading, setLoading] = useState(false)

const fetchEvents = async () => {
  setLoading(true)
  try {
    const response = await axios.get('/api/events/search', {
      params: {
        query: searchQuery,
        category: selectedCategory,
        ...filters
      }
    })
    setEvents(response.data)
  } catch (error) {
    console.error('Error al buscar eventos:', error)
  } finally {
    setLoading(false)
  }
}

useEffect(() => {
  if (showResults) {
    fetchEvents()
  }
}, [searchQuery, selectedCategory, filters])
```

## 📝 Uso

### Navegación:
- Desde TopAppBar: Click en "Explorar" → `/categories`
- Desde BottomNav: Click en icono Buscar → `/categories`

### Flujo de usuario:
1. Usuario entra a la página
2. Ve estado vacío con mensaje motivacional
3. Opciones:
   - **Escribir en búsqueda** → Muestra resultados
   - **Click en categoría rápida** → Filtra por categoría
   - **Click en botón filtros** → Abre modal de filtros avanzados
4. Selecciona filtros y aplica
5. Ve grid de resultados
6. Click en evento → Va a `/event/:id`

## 🎯 Características UX

✅ **Búsqueda en tiempo real**: No necesita botón "Buscar"  
✅ **Filtros persistentes**: Los filtros se mantienen al navegar  
✅ **Feedback visual**: Contador de resultados, badges activos  
✅ **Mobile-first**: Sheet desde abajo en móvil  
✅ **Scroll horizontal**: Categorías accesibles sin cortar  
✅ **Estados vacíos**: Mensaje claro cuando no hay búsqueda  
✅ **Accesibilidad**: Labels, aria-labels, roles correctos  

## 🐛 Testing

### Probar:
1. ✅ Buscar texto en input → Muestra resultados
2. ✅ Click en categoría → Filtra eventos
3. ✅ Abrir Sheet → Modal aparece con animación
4. ✅ Llenar filtros → Se guardan en estado
5. ✅ Click "Aplicar Filtros" → Filtra resultados
6. ✅ Click en backdrop → Cierra modal
7. ✅ Click en X → Cierra modal
8. ✅ Responsive → Funciona en móvil/tablet/desktop
9. ✅ Scroll horizontal categorías → Sin cortar
10. ✅ Click en EventCard → Navega a detalle

## ✨ Mejoras Futuras (Opcionales)

- [ ] Autocompletado en búsqueda
- [ ] Historial de búsquedas recientes
- [ ] Guardar filtros en localStorage
- [ ] Paginación o infinite scroll
- [ ] Ordenar por: fecha, popularidad, distancia
- [ ] Mapa de eventos cercanos
- [ ] Compartir búsqueda (URL con query params)
- [ ] Animación de loading skeleton
- [ ] Resultados por voz (speech-to-text)
- [ ] Sugerencias de búsqueda

## 🎉 Estado: COMPLETADO

La página está 100% funcional, responsive y lista para integrar con backend.

**Archivos modificados/creados:**
- ✅ `pages/Categories.jsx` - Página completa (380+ líneas)
- ✅ `components/ui/Sheet.jsx` - Modal desde abajo (150+ líneas)
- ✅ `components/ui/Label.jsx` - Label accesible (25 líneas)
- ✅ `index.css` - Animaciones CSS (60+ líneas)

**Componentes reutilizados:**
- ✅ Input, Button, Badge, EventCard, TopAppBar, BottomNav

---

**Siguiente paso:** Elige qué página implementar:
- 🔐 **Auth** (Login/Signup)
- ➕ **UploadForm** (Crear evento)
- 👤 **UserDashboard** (Perfil)
