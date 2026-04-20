import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Event from "@/models/Event";

export async function GET(req, { params }) {
  try {
    const { userId } = await params;
    await connectToDatabase();

    // Eventos creados por el usuario
    const personalEvents = await Event.find({ author: userId })
      .sort({ dateTime: -1 });

    // Eventos a los que se ha unido el usuario
    const joinedEvents = await Event.find({ participants: userId })
      .sort({ dateTime: -1 });

    return NextResponse.json({
      personal: personalEvents,
      joined: joinedEvents,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user events:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
