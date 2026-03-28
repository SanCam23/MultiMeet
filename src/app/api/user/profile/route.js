import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";

// Función auxiliar para obtener el usuario actual desde el JWT
async function getUserFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key_multimeet");
    return decoded.id; // Retorna el ID del usuario
  } catch (error) {
    return null;
  }
}

export async function GET() {
  try {
    const userId = await getUserFromCookies();

    if (!userId) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return NextResponse.json({ message: "Error al obtener perfil del usuario" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const userId = await getUserFromCookies();

    if (!userId) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const { name, username, bio, avatar, location } = await request.json();

    await connectToDatabase();

    // Actualiza solo los campos permitidos y retorna el nuevo documento
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { name, username, bio, avatar, location } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return NextResponse.json({ message: "Error al actualizar perfil del usuario" }, { status: 500 });
  }
}
