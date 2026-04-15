import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongoose";
import Event from "@/models/Event";
import User from "@/models/User";
import Notification from "@/models/Notification";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    await connectToDatabase();
    
    const event = await Event.findById(id)
      .populate("author", "name username avatar slug clerkId")
      .populate("participants", "name username avatar slug clerkId")
      .populate("userGallery.user", "name username avatar slug clerkId")
      .populate("ratings.user", "name username avatar slug clerkId")
      .populate("parentEvent", "title coverImage dateTime status");

    if (!event) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    // Buscar ampliaciones de este evento
    const extensions = await Event.find({ parentEvent: id, status: { $ne: "cancelled" } })
      .select("title coverImage dateTime")
      .sort({ dateTime: 1 });

    const eventObj = event.toObject();
    eventObj.extensions = extensions;

    return NextResponse.json(eventObj, { status: 200 });
  } catch (error) {
    console.error("GET /api/events/[id] error:", error);
    return NextResponse.json(
      { error: "Error al obtener el evento" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
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

    if (event.author.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Solo el autor puede eliminar el evento" },
        { status: 403 }
      );
    }

    await Notification.deleteMany({ event: event._id });
    await Event.findByIdAndDelete(event._id);

    return NextResponse.json(
      { message: "Evento eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/events/[id] error:", error);
    return NextResponse.json(
      { error: "Error al eliminar el evento" },
      { status: 500 }
    );
  }
}
