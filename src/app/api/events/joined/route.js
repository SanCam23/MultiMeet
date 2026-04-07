import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongoose";
import Event from "@/models/Event";
import User from "@/models/User";

/**
 * GET /api/events/joined
 * Devuelve los eventos a los que se ha unido el usuario autenticado.
 */
export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: "Debes iniciar sesión" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ clerkId });

    if (!user) {
      return NextResponse.json(
        { error: "No se encontró tu perfil" },
        { status: 404 }
      );
    }

    // Buscamos eventos donde el id del usuario esté en el array de participants
    const events = await Event.find({ participants: user._id })
      .populate("author", "name username avatar slug")
      .sort({ dateTime: -1 });

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("GET /api/events/joined error:", error);
    return NextResponse.json(
      { error: "Error al obtener los eventos a los que estás unido" },
      { status: 500 }
    );
  }
}
