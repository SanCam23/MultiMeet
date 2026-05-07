import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongoose";
import Notification from "@/models/Notification";
import User from "@/models/User";
import Event from "@/models/Event";

/**
 * GET /api/notifications
 * Obtiene las notificaciones del usuario autenticado.
 */
export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const notifications = await Notification.find({ recipient: user._id, read: false })
      .populate("sender", "name username avatar")
      .populate("event", "title")
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ error: "Error al obtener notificaciones" }, { status: 500 });
  }
}

/**
 * PATCH /api/notifications
 * Marca todas las notificaciones como leídas o una específica si se pasa ID.
 */
export async function PATCH(request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await request.json().catch(() => ({}));

    await connectToDatabase();
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (id) {
      await Notification.updateOne({ _id: id, recipient: user._id }, { read: true });
    } else {
      await Notification.updateMany({ recipient: user._id }, { read: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/notifications error:", error);
    return NextResponse.json({ error: "Error al actualizar notificaciones" }, { status: 500 });
  }
}

/**
 * DELETE /api/notifications
 * Elimina una notificación.
 */
export async function DELETE(request) {
    try {
      const { userId: clerkId } = await auth();
      if (!clerkId) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }
  
      const { id } = await request.json().catch(() => ({}));
  
      await connectToDatabase();
      const user = await User.findOne({ clerkId });
      if (!user) {
        return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
      }
  
      if (id) {
        await Notification.deleteOne({ _id: id, recipient: user._id });
      } else {
        await Notification.deleteMany({ recipient: user._id });
      }
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("DELETE /api/notifications error:", error);
      return NextResponse.json({ error: "Error al eliminar notificaciones" }, { status: 500 });
    }
  }
