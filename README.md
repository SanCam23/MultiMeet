# MultiMeet

Plataforma de gestión de contenidos multimedia.

## Estructura del Proyecto

Este es un monorepositorio MERN (MongoDB, Express, React, Node.js).

### Frontend (/client)
- React application

### Backend (/server)
- Node.js + Express API

## Instalación

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

## Tecnologias

- **Frontend**: React
- **Backend**: Node.js, Express
- **Base de datos**: MongoDB
