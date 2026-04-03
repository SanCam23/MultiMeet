import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongoose";
import Event from "@/models/Event";
import User from "@/models/User";

/**
 * GET /api/events
 * Obtiene lista de eventos (opcional: con paginación)
 */
export async function GET() {
  try {
    await connectToDatabase();

    const events = await Event.find()
      .populate("author", "name username avatar slug")
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json(
      { error: "Error al obtener eventos" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/events
 * Crea un nuevo evento
 *
 * Payload esperado:
 * {
 *   title: string,
 *   description: string,
 *   dateTime: string (ISO 8601),
 *   locationText: string,
 *   lat?: number,
 *   lng?: number,
 *   categories: string[],
 *   coverImage?: string (URL),
 *   maxParticipants?: number
 * }
 */
export async function POST(request) {
  try {
    // 1. Verificar autenticación con Clerk
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para crear un evento" },
        { status: 401 }
      );
    }

    // 2. Parsear body y validar campos requeridos
    const body = await request.json();
    const {
      title,
      description,
      dateTime,
      locationText,
      lat,
      lng,
      categories,
      coverImage,
      maxParticipants,
    } = body;

    // Validación de campos obligatorios
    if (!title || !description || !dateTime || !locationText) {
      return NextResponse.json(
        {
          error: "Los campos title, description, dateTime y locationText son obligatorios",
        },
        { status: 400 }
      );
    }

    // Validación de formato de dateTime
    const eventDate = new Date(dateTime);
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json(
        { error: "dateTime no es una fecha válida (usa formato ISO 8601)" },
        { status: 400 }
      );
    }

    // Validación de que la fecha no sea en el pasado
    if (eventDate < new Date()) {
      return NextResponse.json(
        { error: "No puedes crear eventos en el pasado" },
        { status: 400 }
      );
    }

    // Validación de categorías
    if (!Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { error: "Debe haber al menos una categoría" },
        { status: 400 }
      );
    }

    // 3. Conectar a MongoDB y obtener usuario
    await connectToDatabase();

    const user = await User.findOne({ clerkId });

    if (!user) {
      return NextResponse.json(
        { error: "No se encontró tu perfil en la base de datos" },
        { status: 404 }
      );
    }

    // 4. Crear el evento
    const newEvent = await Event.create({
      title: title.trim(),
      description: description.trim(),
      dateTime: eventDate,
      locationText: locationText.trim(),
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      categories: Array.isArray(categories)
        ? categories.map((c) => c.trim())
        : [],
      coverImage: coverImage ? coverImage.trim() : "",
      maxParticipants: maxParticipants ? parseInt(maxParticipants, 10) : null,
      author: user._id,
      status: "active",
      participantsCount: 1, // El autor cuenta como participante
    });

    // 5. Popular autor y devolver evento creado
    const populatedEvent = await Event.findById(newEvent._id).populate(
      "author",
      "name username avatar slug"
    );

    return NextResponse.json(populatedEvent, { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);

    // Errores de validación de Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((e) => e.message)
        .join(", ");
      return NextResponse.json({ error: messages }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Error al crear el evento" },
      { status: 500 }
    );
  }
}
