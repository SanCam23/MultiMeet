# MultiMeet

MultiMeet es una aplicación web moderna y adaptable (responsive) diseñada con un objetivo claro: **conectar a las personas a través de experiencias y eventos compartidos**. 

En un mundo cada vez más digital, MultiMeet busca romper la barrera de la pantalla facilitando la interacción en el mundo real. Nuestro objetivo principal es proporcionar una plataforma integral, accesible e intuitiva donde cualquier persona pueda descubrir, crear y organizar eventos locales. Ya sea un encuentro deportivo, una exposición de arte, un grupo de estudio o una reunión social, MultiMeet centraliza todas estas actividades en un mapa interactivo, fomentando la creación de comunidades locales más fuertes, activas y conectadas.

## 🚀 Características Principales

- **Descubrimiento de Eventos y Mapa Interactivo:** Explora eventos de forma fluida a través de un mapa interactivo o una vista de lista categorizada, permitiendo localizar actividades cerca de ti al instante.
- **Autenticación de Usuarios:** Gestión de usuarios y autenticación segura respaldada por [Clerk](https://clerk.com/).
- **Perfiles Personalizados:** Los usuarios pueden crear perfiles detallados, ajustar su ubicación y añadir una biografía para conectar mejor con otros asistentes.
- **Búsqueda por Categorías:** Filtra y encuentra fácilmente eventos basados en intereses o categorías específicas.
- **Diseño Adaptativo (Responsive):** Una interfaz completamente optimizada tanto para dispositivos móviles como de escritorio, con una estética de diseño moderna y soporte nativo para modo oscuro.
- **Onboarding Fluido:** Un proceso de registro e introducción diseñado para que los usuarios configuren su cuenta rápida y eficientemente.

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Base de Datos:** MongoDB (mediante [Mongoose](https://mongoosejs.com/))
- **Autenticación:** [Clerk](https://clerk.com/)
- **Almacenamiento de Archivos:** Integración con la API de Dropbox
- **Estilos:** CSS / Componentes UI Modernos
- **Despliegue:** [Vercel](https://vercel.com/)

## 🔌 APIs e Integraciones Utilizadas

Para ofrecer todas sus funcionalidades, MultiMeet se integra de manera robusta con diversas APIs de terceros:

- **Clerk API:** Gestión completa de identidades, registro seguro, inicio de sesión y administración de perfiles de usuario. Se complementa con **Svix** para gestionar y recibir webhooks en tiempo real (útil para la sincronización de la base de datos).
- **Dropbox API:** Utilizada como solución de almacenamiento en la nube para guardar y gestionar de forma segura los recursos y archivos (como imágenes de perfil o fotos de los eventos).
- **Groq API:** Integración de Inteligencia Artificial para potenciar las capacidades de la aplicación mediante procesamiento de lenguaje natural de altísima velocidad.
- **Leaflet / OpenStreetMap:** API de mapas de código abierto empleada (junto a `react-leaflet`) para renderizar los mapas interactivos, facilitando a los usuarios localizar la ubicación exacta de los distintos eventos de forma visual.

## ⚙️ Guía de Inicio

Para obtener una copia local y ejecutarla en tu máquina, sigue estos sencillos pasos:

### Prerrequisitos

- Node.js (se recomienda la versión v18.0.0 o superior)
- Gestor de paquetes: npm, yarn, pnpm, o bun

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/multimeet.git
   ```

2. Navega al directorio del proyecto:
   ```bash
   cd MultiMeet
   ```

3. Instala las dependencias necesarias:
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

4. Configura tus variables de entorno:
   Crea un archivo `.env.local` en la raíz del proyecto y añade las credenciales requeridas para MongoDB, Clerk y Dropbox.
   ```env
   multimeet_MONGODB_URI=tu_mongodb_uri
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=tu_clerk_publishable_key
   CLERK_SECRET_KEY=tu_clerk_secret_key
   CLERK_WEBHOOK_SECRET=tu_clerk_webhook_secret
   DROPBOX_APP_KEY=tu_dropbox_app_key
   DROPBOX_APP_SECRET=tu_dropbox_app_secret
   DROPBOX_REFRESH_TOKEN=tu_dropbox_refresh_token
   GROQ_API_KEY=tu_groq_api_key
   ```

5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   # o
   yarn dev
   ```

6. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación en funcionamiento.

## 👨‍💻 Equipo de Desarrollo

Este proyecto ha sido desarrollado y es mantenido por:

- **Santino Campessi Lojo**
- **Mario Laguna Contreras**
- **Arnau Donat García**

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.
