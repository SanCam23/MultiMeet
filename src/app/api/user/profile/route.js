import { NextResponse } from "next/server";
import { auth, currentUser, createClerkClient } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    await connectToDatabase();

    // Buscamos al usuario en Mongoose por su ID de Clerk
    let user = await User.findOne({ clerkId: userId });

    // UPSERT: Si el usuario existe en Clerk pero todavía no en nuestra BD de Mongo, lo creamos "al vuelo".
    if (!user) {
      const clerkUser = await currentUser();
      
      if (!clerkUser) {
        return NextResponse.json({ message: "Error al obtener datos de Clerk" }, { status: 500 });
      }

      const email = clerkUser.emailAddresses[0]?.emailAddress || "";
      const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Usuario sin nombre";
      const avatar = clerkUser.imageUrl || "";

      user = await User.create({
        clerkId: userId,
        email,
        name,
        avatar,
        username: clerkUser.username || "",
        bio: "",
        location: "",
      });
      console.log("Usuario creado automáticamente en MongoDB desde Clerk:", user);
    } else {
      // Sincronizar Avatar en Tiempo Real al cargar el perfil
      const clerkUser = await currentUser();
      if (clerkUser && clerkUser.imageUrl && clerkUser.imageUrl !== user.avatar) {
        user.avatar = clerkUser.imageUrl;
        await user.save();
        console.log("Avatar actualizado on-the-fly desde Clerk.");
      }
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error al obtener o crear perfil de Clerk:", error);
    return NextResponse.json({ message: "Error al obtener perfil del usuario" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { userId } = await auth();
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

    if (!userId) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const { name, username, bio, avatar, location } = await request.json();

    // 1. SINCRONIZAR CON CLERK
    // Protegemos contra campos undefined
    const safeName = (name || "").trim() || "Usuario sin nombre";
    const nameParts = safeName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    try {
      // Limpiamos el username para Clerk
      const cleanUsername = username?.startsWith("@") ? username.slice(1) : username;
      
      const updateData = {
        firstName,
        lastName,
      };

      // Clerk solo permite minúsculas, números y guiones en el username
      if (cleanUsername) {
        updateData.username = cleanUsername.toLowerCase().trim().replace(/\s+/g, '-');
      }

      await clerk.users.updateUser(userId, updateData);
      console.log("Clerk Sync exitoso.");
    } catch (clerkError) {
      console.warn("Aviso: Sincronización con Clerk fallida (probablemente username ya en uso):", clerkError.message);
    }

    await connectToDatabase();

    // 2. ACTUALIZAR MONGODB
    const clerkUser = await currentUser();
    const finalAvatar = clerkUser?.imageUrl || avatar;

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: { name: safeName, username, bio, avatar: finalAvatar, location } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "Usuario no encontrado en la Base de Datos" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return NextResponse.json({ message: "Error al actualizar perfil del usuario" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const { userId } = await auth();
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

    if (!userId) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    await connectToDatabase();

    // 1. Eliminar de MongoDB
    await User.findOneAndDelete({ clerkId: userId });
    console.log(`Usuario ${userId} eliminado de MongoDB manualmente.`);

    // 2. Eliminar de Clerk (esto disparará la desconexión del usuario)
    await clerk.users.deleteUser(userId);
    console.log(`Usuario ${userId} eliminado de Clerk manualmente.`);

    return NextResponse.json({ message: "Cuenta eliminada con éxito" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar cuenta:", error);
    return NextResponse.json({ message: "Error al eliminar la cuenta" }, { status: 500 });
  }
}

