import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    const { username } = await params;
    
    // El username en la URL puede venir con @ o sin él
    const finalUsername = username.startsWith("%40") || username.startsWith("@") 
      ? username.replace("%40", "@")
      : `@${username}`;

    await connectToDatabase();
    
    const decodedUsername = decodeURIComponent(username);
    const decodedFinal = decodeURIComponent(finalUsername);

    // Buscamos al usuario por su slug (ej: "carlos-ruiz") o su username (ej: "@carlosruiz")
    const user = await User.findOne({
      $or: [
        { slug: { $regex: new RegExp(`^${decodedUsername}$`, 'i') } },
        { username: { $regex: new RegExp(`^${decodedFinal}$`, 'i') } },
        { username: { $regex: new RegExp(`^${decodedUsername}$`, 'i') } },
      ]
    }).select("-email -clerkId"); // Omitimos campos sensibles

    if (!user) {
      console.warn(`User search failed for: ${decodedUsername} / ${decodedFinal}`);
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Fetch public user error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
