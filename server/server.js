import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Inicializar Express
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '🚀 API de MultiMeet funcionando correctamente' });
});

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🟢 Servidor corriendo en puerto ${PORT}`);
});
