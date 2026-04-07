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
      return NextResponse.json({ error: "Solo el autor puede finalizar el evento" }, { status: 403 });
    }

    event.status = "finished";
    await event.save();

    return NextResponse.json({ message: "Evento finalizado correctamente", event }, { status: 200 });
  } catch (error) {
    console.error("POST /api/events/[id]/finish error:", error);
    return NextResponse.json({ error: "Error al finalizar el evento" }, { status: 500 });
  }
}
