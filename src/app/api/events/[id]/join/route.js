import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
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

    // Toggle participant logic
    const isParticipant = event.participants.includes(user._id);

    if (isParticipant) {
      event.participants.pull(user._id);
      event.participantsCount = Math.max(0, event.participantsCount - 1);
    } else {
      event.participants.push(user._id);
      event.participantsCount += 1;
    }

    await event.save();
    
    // Crear notificación si se acaba de unir y no es su propio evento
    if (!isParticipant && event.author.toString() !== user._id.toString()) {
      try {
        await Notification.create({
          recipient: event.author,
          sender: user._id,
          type: "eventJoin",
          event: event._id,
        });
      } catch (err) {
        console.error("Error creating join notification:", err);
      }
    }

    return NextResponse.json(
      { joined: !isParticipant, participantsCount: event.participantsCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/events/[id]/join error:", error);
    return NextResponse.json({ error: "Error al unirse al evento" }, { status: 500 });
  }
}
