import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import Notification from "@/models/Notification";

export async function GET(req, { params }) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ isFollowing: false });
    }

    const { targetId } = await params;

    await connectToDatabase();
    const currentUser = await User.findOne({ clerkId });
    if (!currentUser) {
      return NextResponse.json({ isFollowing: false });
    }

    const isFollowing = currentUser.following.some(id => id.toString() === targetId);
    return NextResponse.json({ isFollowing });
  } catch (error) {
    console.error("GET Follow status error:", error);
    return NextResponse.json({ isFollowing: false });
  }
}

export async function POST(req, { params }) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Inicia sesión para seguir a otros usuarios" }, { status: 401 });
    }

    const { targetId } = await params;

    await connectToDatabase();

    // 1. Obtener usuario actual (el que quiere seguir)
    const currentUser = await User.findOne({ clerkId });
    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado en la base de datos" }, { status: 404 });
    }

    // 2. No se puede seguir a uno mismo
    if (currentUser._id.toString() === targetId) {
      return NextResponse.json({ error: "No puedes seguirte a ti mismo" }, { status: 400 });
    }

    // 3. Obtener usuario objetivo (el que va a ser seguido)
    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return NextResponse.json({ error: "El usuario que intentas seguir no existe" }, { status: 404 });
    }

    const isFollowing = currentUser.following.some(id => id.toString() === targetId.toString());
    console.log(`[DEBUG] Follow toggle: Me(${currentUser._id}) -> Target(${targetId}). Current state: ${isFollowing}`);

    if (isFollowing) {
      // Unfollow Logic
      currentUser.following = currentUser.following.filter(id => id.toString() !== targetId);
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUser._id.toString());
    } else {
      // Follow Logic
      currentUser.following.push(targetId);
      targetUser.followers.push(currentUser._id);
    }

    await currentUser.save();
    await targetUser.save();

    // Crear notificación si es un nuevo follow
    if (!isFollowing) {
      try {
        await Notification.create({
          recipient: targetUser._id,
          sender: currentUser._id,
          type: "follow",
        });
      } catch (err) {
        console.error("Error creating follow notification:", err);
      }
    }

    console.log(`[DEBUG] Saved! New Following total: ${currentUser.following.length}, Target Followers total: ${targetUser.followers.length}`);

    return NextResponse.json({ 
      isFollowing: !isFollowing,
      followersCount: targetUser.followers.length,
      message: isFollowing ? "Has dejado de seguir a este usuario" : "Ahora sigues a este usuario"
    }, { status: 200 });

  } catch (error) {
    console.error("Follow POST error:", error);
    return NextResponse.json({ error: "Error interno del servidor al procesar el seguimiento" }, { status: 500 });
  }
}
