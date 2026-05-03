import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    const { userId } = await params;
    await connectToDatabase();

    // Validamos que sea un ObjectId válido para evitar errores de casting
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "ID de usuario inválido" }, { status: 400 });
    }

    const user = await User.findById(userId)
      .populate("followers following", "name username avatar slug")
      .select("-email -clerkId");

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Fetch user by ID error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
