# MultiMeet

Plataforma moderna de gestión y descubrimiento de eventos y reuniones sociales.

## 📖 Descripción

MultiMeet es una aplicación web MERN (MongoDB, Express, React, Node.js) que permite a los usuarios descubrir, crear y gestionar eventos sociales. La aplicación cuenta con un diseño moderno y responsive basado en Figma, con una experiencia de usuario optimizada tanto para dispositivos móviles como de escritorio.

## 🎨 Características Principales

- 🏠 **Home** - Descubre eventos de personas que sigues o los más populares en tu ciudad
- 🔍 **Búsqueda y Categorías** - Filtra eventos por categorías y ubicación
- ➕ **Crear Eventos** - Publica tus propios eventos
- 👤 **Perfil de Usuario** - Gestiona tu perfil y tus eventos
- 🔔 **Notificaciones** - Mantente al día con actualizaciones
- 📱 **Responsive Design** - Experiencia optimizada para todos los dispositivos

## Estructura del Proyecto

Este es un monorepositorio MERN (MongoDB, Express, React, Node.js).

### Frontend (/client)
- React 18 + Vite
- Tailwind CSS
- React Router DOM
- Radix UI Components
- Lucide Icons

### Backend (/server)
- Node.js + Express API
- MongoDB + Mongoose
- JWT Authentication (próximamente)

## 🚀 Instalación

### Backend
```bash
cd server
npm install
npm start
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## 🎨 Sistema de Diseño

### Paleta de Colores
- **Primary**: `#7209B7` (Púrpura) - Acciones principales
- **Secondary**: `#7CCFEB` (Azul claro) - Acciones secundarias  
- **Accent**: `#9263F8` (Púrpura claro) - Acentos
- **Background**: `#F8F9FA` (Gris muy claro)

### Componentes UI Disponibles
- ✅ Tabs, Badge, Button, Input, Card
- ✅ EventCard, TopAppBar, BottomNav

## 📱 Responsive
- **Móvil** (< 768px): 1 columna, navegación inferior
- **Tablet** (768px - 1024px): 2 columnas
- **Desktop** (> 1024px): 3 columnas, navegación superior

## 📝 Estado del Desarrollo

### ✅ Completado
- [x] Configuración inicial del proyecto
- [x] Sistema de diseño y componentes UI
- [x] Página Home responsive
- [x] Componentes reutilizables

### 🚧 Próximamente
- [ ] Autenticación
- [ ] Integración con backend
- [ ] Más páginas (Auth, Categories, etc.)

## 📚 Documentación

- [Client README](./client/README.md) - Documentación del frontend
- [Implementation Guide](./client/IMPLEMENTATION.md) - Guía del Home

## Tecnologías

- **Frontend**: React, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express
- **Base de datos**: MongoDB
