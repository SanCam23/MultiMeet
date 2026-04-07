import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Event from "@/models/Event";
import User from "@/models/User";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    await connectToDatabase();
    
    const event = await Event.findById(id)
      .populate("author", "name username avatar slug clerkId")
      .populate("participants", "name username avatar slug clerkId")
      .populate("userGallery.user", "name username avatar slug clerkId")
      .populate("ratings.user", "name username avatar slug clerkId");

    if (!event) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("GET /api/events/[id] error:", error);
    return NextResponse.json(
      { error: "Error al obtener el evento" },
      { status: 500 }
    );
  }
}
