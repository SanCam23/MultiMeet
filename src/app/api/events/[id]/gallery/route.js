import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongoose";
import Event from "@/models/Event";
import User from "@/models/User";

export async function POST(request, { params }) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { url, type = "image" } = body;

    if (!url) {
      return NextResponse.json({ error: "La URL del recurso es obligatoria" }, { status: 400 });
    }

    const { id } = await params;
    await connectToDatabase();

    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    if (event.status !== "finished") {
      return NextResponse.json({ error: "Solo se pueden añadir fotos a eventos finalizados" }, { status: 400 });
    }

    const memory = {
      url,
      type,
      user: user._id,
      uploadedAt: new Date()
    };

    event.userGallery.push(memory);
    await event.save();

    // Populate user to return it
    await event.populate("userGallery.user", "name username avatar slug");

    return NextResponse.json({ message: "Recurso añadido", userGallery: event.userGallery }, { status: 200 });
  } catch (error) {
    console.error("POST /api/events/[id]/gallery error:", error);
    return NextResponse.json({ error: "Error al subir a la galería" }, { status: 500 });
  }
}
