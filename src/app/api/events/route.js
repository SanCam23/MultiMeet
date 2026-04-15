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
      parentEventId,
    } = body;

    // Validación básica de título, descripción y fecha
    if (!title || !description || !dateTime) {
      return NextResponse.json(
        { error: "Los campos title, description y dateTime son obligatorios" },
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

    // 3. Conectar a MongoDB y procesar herencia / validación extra
    await connectToDatabase();

    let parentEvent = null;
    if (parentEventId) {
      parentEvent = await Event.findById(parentEventId);
      if (!parentEvent) {
        return NextResponse.json(
          { error: "El evento original que se intenta ampliar no existe" },
          { status: 404 }
        );
      }
      
      // La ampliación debe ser POSTERIOR al evento padre
      if (eventDate <= new Date(parentEvent.dateTime)) {
        return NextResponse.json(
          { error: "La fecha y hora de la ampliación debe ser obligatoriamente posterior al evento original." },
          { status: 400 }
        );
      }
    }

    // Herencia de campos (si no se proveen, se rellenan con los del padre)
    const finalLocationText = locationText || parentEvent?.locationText;
    const finalLat = lat !== undefined && lat !== null ? lat : parentEvent?.lat;
    const finalLng = lng !== undefined && lng !== null ? lng : parentEvent?.lng;
    const finalCategories = (categories && categories.length > 0) ? categories : parentEvent?.categories || [];
    const finalCoverImage = coverImage || parentEvent?.coverImage || "";

    if (!finalLocationText) {
      return NextResponse.json(
        { error: "La ubicación del evento es obligatoria" },
        { status: 400 }
      );
    }

    if (!finalCategories || finalCategories.length === 0) {
      return NextResponse.json(
        { error: "Debe haber al menos una categoría" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      return NextResponse.json(
        { error: "No se encontró tu perfil en la base de datos" },
        { status: 404 }
      );
    }

    // 4. Crear el evento con la referencia parentEvent
    const newEvent = await Event.create({
      title: title.trim(),
      description: description.trim(),
      dateTime: eventDate,
      locationText: finalLocationText.trim(),
      lat: finalLat ? parseFloat(finalLat) : null,
      lng: finalLng ? parseFloat(finalLng) : null,
      categories: finalCategories.map((c) => c.trim()),
      coverImage: finalCoverImage.trim(),
      maxParticipants: maxParticipants ? parseInt(maxParticipants, 10) : null,
      author: user._id,
      parentEvent: parentEvent ? parentEvent._id : null,
      status: "active",
      participantsCount: 1, // El autor cuenta como participante
      participants: [user._id],
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
