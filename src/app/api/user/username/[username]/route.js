import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    const { username } = await params;
    await connectToDatabase();
    
    const decodedVal = decodeURIComponent(username);
    // Limpiamos el @ del inicio para la búsqueda por slug
    const cleanVal = decodedVal.startsWith('@') ? decodedVal.slice(1) : decodedVal;
    // Preparamos la versión con @ para búsqueda por username
    const atVal = `@${cleanVal}`;

    console.log(`API [GET] /api/user/username/${username} -> searching for clean: ${cleanVal}, at: ${atVal}`);

    const user = await User.findOne({
      $or: [
        { slug: { $regex: new RegExp(`^${cleanVal}$`, 'i') } },
        { username: { $regex: new RegExp(`^${cleanVal}$`, 'i') } },
        { username: { $regex: new RegExp(`^${atVal}$`, 'i') } },
        // Fallback for cases where slug might be something else
        { slug: { $regex: new RegExp(`^${decodedVal}$`, 'i') } },
      ]
    })
    .populate("followers following", "name username avatar slug")
    .select("-email -clerkId");

    if (!user) {
      console.warn(`User search failed for: ${decodedVal}`);
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Fetch public user error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
