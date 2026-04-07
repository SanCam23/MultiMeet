import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";

/**
 * PATCH /api/user/preferences
 * Actualiza las preferencias de tema y accesibilidad del usuario.
 */
export async function PATCH(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const { theme, largeText } = await request.json();

    await connectToDatabase();

    const updateData = {};
    if (theme !== undefined) updateData["preferences.theme"] = theme;
    if (largeText !== undefined) updateData["preferences.largeText"] = largeText;

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(updatedUser.preferences, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar preferencias:", error);
    return NextResponse.json({ message: "Error al actualizar preferencias" }, { status: 500 });
  }
}
