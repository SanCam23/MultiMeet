import fs from 'fs';
import mongoose from 'mongoose';
import Event from './src/models/Event.js';
import User from './src/models/User.js';

// Load variables from .env.local
try {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const lines = envFile.split('\n');
  for (const line of lines) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
} catch (err) {
  console.error("No se pudo leer .env.local, asegúrate de ejecutar el script en la raíz del proyecto.");
}

const MONGODB_URI = process.env.multimeet_MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Falta multimeet_MONGODB_URI en .env.local");
  process.exit(1);
}

const seedEvents = [
  {
    title: "Tarde de Juegos de Mesa",
    description: "Únete a nosotros para una tarde llena de diversión, estrategia y risas. Traeremos juegos clásicos y modernos, pero siéntete libre de traer tus favoritos. ¡Ideal para conocer gente nueva!",
    locationText: "Cafetería La Guarida, Centro Ciudad",
    lat: 40.4168,
    lng: -3.7038,
    categories: ["Ocio", "Juegos", "Social"],
    maxParticipants: 15,
    coverImage: "https://www.dropbox.com/scl/fi/g8y6tnrbvjc8v8zy7ox4g/juegos-mesa.jpg?rlkey=vcl6nde40q2x7tyjgjgpvh4fm&st=5uapgx21&raw=1",
  },
  {
    title: "Intercambio de Idiomas Español-Inglés",
    description: "Practica inglés o español en un ambiente relajado. Haremos rondas de 15 minutos en cada idioma. Abierto a todos los niveles.",
    locationText: "Bar El Viajero",
    lat: 40.4125,
    lng: -3.7114,
    categories: ["Educación", "Social", "Idiomas"],
    maxParticipants: 30,
    coverImage: "https://www.dropbox.com/scl/fi/t9cnzr6d44i24uuny86cj/intercambio-idiomas.jpg?rlkey=ypnh1my5guu8j2kcpvygi9t63&st=v2y9hy0p&raw=1",
  },
  {
    title: "Ruta de Senderismo en la Montaña",
    description: "Una ruta de nivel intermedio para disfrutar de la naturaleza. Son aproximadamente 12km. Traed buen calzado, agua y comida para el picnic a medio día.",
    locationText: "Punto de encuentro: Estación de tren Norte",
    lat: 40.7122,
    lng: -3.9511,
    categories: ["Deportes", "Naturaleza", "Aventura"],
    maxParticipants: 20,
    coverImage: "https://www.dropbox.com/scl/fi/4v5lckzqni4mbfgt64qwg/senderismo-montana.jpg?rlkey=m15giinfsihe8pmezdix2nq8h&st=pxroqeqr&raw=1",
  },
  {
    title: "Taller de Cerámica Básica",
    description: "Aprende las técnicas básicas de modelado a mano. No necesitas experiencia previa, todos los materiales están incluidos. ¡Te llevarás a casa tu propia taza!",
    locationText: "Taller Arte y Barro",
    lat: 40.4231,
    lng: -3.6987,
    categories: ["Arte", "Creatividad", "Taller"],
    maxParticipants: 10,
    coverImage: "https://www.dropbox.com/scl/fi/dggfovoorssatr3zc7326/taller-ceramica.jpg?rlkey=qoxrh2sbdcxak18n8foe49s3t&st=fwwr88mb&raw=1",
  },
  {
    title: "Clase de Yoga al Aire Libre",
    description: "Empieza el fin de semana con energía y paz interior. Clase de Vinyasa Yoga apta para todos los niveles. Por favor, trae tu propia esterilla (mat).",
    locationText: "Parque del Retiro, zona del Palacio de Cristal",
    lat: 40.4150,
    lng: -3.6826,
    categories: ["Deportes", "Salud", "Bienestar"],
    maxParticipants: 25,
    coverImage: "https://www.dropbox.com/scl/fi/k679wlo5kh5x63o3hzil3/yoga-parque.jpg?rlkey=lrwcypnoayoujbikv9wvv04b0&st=ie90fsc8&raw=1",
  },
  {
    title: "Club de Lectura: Ciencia Ficción",
    description: "Este mes estaremos comentando 'Dune' de Frank Herbert. Ven a compartir tus impresiones, teorías y conocer a otros apasionados de la ciencia ficción.",
    locationText: "Librería Central, Sala de reuniones",
    lat: 40.4201,
    lng: -3.7052,
    categories: ["Ocio", "Libros", "Cultura"],
    maxParticipants: 12,
    coverImage: "https://www.dropbox.com/scl/fi/idgh2rrtohsilnjtf5cs2/club-lectura.jpg?rlkey=465lovr8zxlyt13xbvvpzea92&st=0tt50jbf&raw=1",
  },
  {
    title: "Feria Gastronómica Vegana",
    description: "Descubre los mejores platos plant-based de la ciudad en un solo lugar. Habrá música en vivo, charlas y mucha comida deliciosa.",
    locationText: "Plaza Mayor",
    lat: 40.4155,
    lng: -3.7074,
    categories: ["Comida", "Gastronomía", "Social"],
    maxParticipants: 100,
    coverImage: "https://www.dropbox.com/scl/fi/xtkrvqjuldxkwrxh70q8r/feria-vegana.jpg?rlkey=hruxmfc6h2i1opbc23b7j9rb5&st=6txtj9cp&raw=1",
  },
  {
    title: "Concierto Indie Local",
    description: "Apoya a la escena musical emergente. Tres bandas locales tocarán en vivo esta noche. La entrada incluye una consumición.",
    locationText: "Sala Sol",
    lat: 40.4180,
    lng: -3.7020,
    categories: ["Música", "Ocio", "Arte"],
    maxParticipants: 50,
    coverImage: "https://www.dropbox.com/scl/fi/5pyf0dfz5j5vsayrr7x2a/concierto-indie.jpg?rlkey=zhgfzq0zn001q035tafv8ih5t&st=orofdvjv&raw=1",
  }
];

async function seedDatabase() {
  try {
    console.log("Conectando a la base de datos...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    // Buscar el usuario específico
    let user = await User.findOne({ clerkId: "user_3Br1m26UA8eEZMtZUlcHI607xEv" });
    if (!user) {
      console.log("No se encontró el usuario especificado. Creándolo...");
      user = await User.create({
        clerkId: "user_3Br1m26UA8eEZMtZUlcHI607xEv",
        name: "mario laguna",
        email: "mlagunac25@gmail.com",
        username: "mlagunac25",
        bio: "Usuario administrador asignado por el script de seed",
      });
      console.log(`✅ Usuario creado: ${user.name}`);
    } else {
      console.log(`✅ Usando usuario existente como autor: ${user.name}`);
    }

    console.log("Insertando eventos...");
    
    // Asignar el autor y ajustar las fechas para que sean futuras (mínimo 5 meses)
    const eventsToInsert = seedEvents.map((event, index) => {
      const eventDate = new Date();
      // Sumar 5 meses desde la fecha actual como mínimo
      eventDate.setMonth(eventDate.getMonth() + 5);
      // Incrementar la fecha en (index + 1) días para que se vean dispersos en el calendario
      eventDate.setDate(eventDate.getDate() + index + 1);
      // Añadir algo de variabilidad a la hora
      eventDate.setHours(17 + (index % 4), 30, 0, 0);

      return {
        ...event,
        author: user._id,
        dateTime: eventDate,
        status: "active",
      };
    });

    // Inserción de eventos
    const result = await Event.insertMany(eventsToInsert);
    console.log(`✅ ¡Éxito! Se han insertado ${result.length} eventos nuevos.`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    process.exit(1);
  }
}

seedDatabase();
