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
    const { rating } = body;

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "La valoración debe ser un número entre 1 y 5" }, { status: 400 });
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
      return NextResponse.json({ error: "Solo se puede valorar un evento finalizado" }, { status: 400 });
    }

    const existingRatingIndex = event.ratings.findIndex(r => r.user.toString() === user._id.toString());
    
    if (existingRatingIndex > -1) {
      event.ratings[existingRatingIndex].value = rating;
      event.ratings[existingRatingIndex].createdAt = new Date();
    } else {
      event.ratings.push({
        user: user._id,
        value: rating,
        createdAt: new Date()
      });
    }

    await event.save();

    return NextResponse.json({ message: "Valoración guardada", ratings: event.ratings }, { status: 200 });
  } catch (error) {
    console.error("POST /api/events/[id]/rating error:", error);
    return NextResponse.json({ error: "Error al guardar la valoración" }, { status: 500 });
  }
}
