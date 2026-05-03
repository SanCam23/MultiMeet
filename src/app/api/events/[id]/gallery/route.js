import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { deleteDropboxFileBySharedUrl } from "@/lib/dropbox";
import connectToDatabase from "@/lib/mongoose";
import Event from "@/models/Event";
import User from "@/models/User";
import Notification from "@/models/Notification";

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

    const isFinished = event.status === "finished" || new Date(event.dateTime) < new Date();
    if (!isFinished) {
      return NextResponse.json({ error: "Solo se pueden añadir fotos a eventos finalizados o que ya han pasado" }, { status: 400 });
    }

    const isParticipant = event.participants.some(p => p.toString() === user._id.toString());
    const isAuthor = event.author.toString() === user._id.toString();

    if (!isParticipant && !isAuthor) {
      return NextResponse.json({ error: "Solo los participantes o el autor pueden añadir fotos" }, { status: 403 });
    }

    const memory = {
      url,
      type,
      user: user._id,
      uploadedAt: new Date()
    };

    event.userGallery.push(memory);
    await event.save();
    
    // Crear notificación si sube alguien distinto al autor del evento
    if (event.author.toString() !== user._id.toString()) {
      try {
        await Notification.create({
          recipient: event.author,
          sender: user._id,
          type: "photoUpload",
          event: event._id,
        });
      } catch (err) {
        console.error("Error creating photo upload notification:", err);
      }
    }

    // Populate user to return it
    await event.populate("userGallery.user", "name username avatar slug");

    return NextResponse.json({ message: "Recurso añadido", userGallery: event.userGallery }, { status: 200 });
  } catch (error) {
    console.error("POST /api/events/[id]/gallery error:", error);
    return NextResponse.json({ error: "Error al subir a la galería" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json({ error: "El ID del elemento es obligatorio" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    const itemIndex = event.userGallery.findIndex((item) => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return NextResponse.json({ error: "Imagen no encontrada en la galería" }, { status: 404 });
    }

    const item = event.userGallery[itemIndex];

    // Verificar permisos: solo el que subió la foto o el autor del evento pueden borrarla
    const isUploader = item.user.toString() === user._id.toString();
    const isAuthor = event.author.toString() === user._id.toString();

    if (!isUploader && !isAuthor) {
      return NextResponse.json({ error: "No tienes permiso para borrar esta imagen" }, { status: 403 });
    }

    // Intentar borrar de Dropbox (opcional, no bloqueamos si falla)
    try {
      await deleteDropboxFileBySharedUrl(item.url);
    } catch (dropboxErr) {
      console.error("Error deleting from Dropbox during gallery removal:", dropboxErr);
    }

    // Eliminar del array
    event.userGallery.splice(itemIndex, 1);
    await event.save();

    // Populate user to return it
    await event.populate("userGallery.user", "name username avatar slug");

    return NextResponse.json({ message: "Imagen eliminada", userGallery: event.userGallery }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/events/[id]/gallery error:", error);
    return NextResponse.json({ error: "Error al eliminar la imagen" }, { status: 500 });
  }
}

