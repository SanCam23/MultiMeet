# MultiMeet

Red social que conecta a personas para organizar y participar en actividades presenciales.

## Estructura del Proyecto

Este es un monorepositorio MERN (MongoDB, Express, React, Node.js).

### Frontend (/client)
- Aplicacion React

### Backend (/server)
- API con Node.js + Express

## Instalacion

### Backend
```bash
cd server
npm install
```

### Frontend
```bash
cd client
npm install
```

## Desarrollo

### Backend
```bash
cd server
npm start
```

### Frontend
```bash
cd client
npm start
```

## Tecnologias

- **Frontend: React**
	Libreria para construir interfaces de usuario con componentes reutilizables en el navegador. El frontend se desarrolla principalmente en JavaScript y JSX (JavaScript con sintaxis de componentes), junto con CSS para estilos. La aplicacion consume la API del backend para mostrar actividades, perfiles y publicaciones.
	**Uso**: en `/client`, ejecuta `npm start` para levantar el frontend y desarrolla en `src/`, creando componentes y paginas en JavaScript/JSX.

- **Backend: Node.js + Express**
	Entorno de ejecucion para JavaScript en servidor y framework para crear APIs HTTP. El backend se implementa en JavaScript, define rutas, controladores y middleware para autenticar usuarios y gestionar actividades. Se encarga de la logica de negocio y de exponer endpoints consumidos por el frontend.
	**Uso**: en `/server`, ejecuta `npm start` para levantar la API y define rutas en el codigo del servidor, usando JavaScript y Express.

- **Base de datos: MongoDB**
	Base de datos NoSQL orientada a documentos, ideal para datos flexibles como usuarios, eventos y publicaciones. Se consulta desde el backend con JavaScript a traves de modelos, lo que permite almacenar y recuperar la informacion de forma estructurada sin un esquema rigido.
	**Uso**: configura la cadena de conexion en el servidor y crea modelos/colecciones para persistir datos desde el backend.
