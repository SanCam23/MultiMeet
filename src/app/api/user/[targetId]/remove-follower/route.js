import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";

/**
 * Permite al usuario logueado (objetivo) ELIMINAR a una persona específica de
 * su propia lista de seguidores (Kicking out).
 */
export async function POST(req, { params }) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetId } = await params; // El ID del seguidor que queremos expulsar

    await connectToDatabase();

    const currentUser = await User.findOne({ clerkId });
    if (!currentUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 1. Eliminarlo de mi lista de followers
    currentUser.followers = currentUser.followers.filter(
      (id) => id._id?.toString() !== targetId && id.toString() !== targetId
    );

    // 2. También somos proactivos: En el perfil del seguidor, eliminamos que nos esté siguiendo
    const followerUser = await User.findById(targetId);
    if (followerUser) {
      followerUser.following = followerUser.following.filter(
        (id) => id._id?.toString() !== currentUser._id.toString() && id.toString() !== currentUser._id.toString()
      );
      await followerUser.save();
    }

    await currentUser.save();

    return NextResponse.json({ success: true, message: "Seguidor eliminado correctamente" });
  } catch (error) {
    console.error("Remove follower error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
