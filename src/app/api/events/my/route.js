import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongoose";
import Event from "@/models/Event";
import User from "@/models/User";

/**
 * GET /api/events/my
 * Devuelve los eventos creados por el usuario autenticado.
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

    const events = await Event.find({ author: user._id })
      .populate("author", "name username avatar slug")
      .sort({ createdAt: -1 });

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("GET /api/events/my error:", error);
    return NextResponse.json(
      { error: "Error al obtener tus eventos" },
      { status: 500 }
    );
  }
}
