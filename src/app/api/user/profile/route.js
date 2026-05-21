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
    // Populamos seguidores y seguidos para tener sus datos en el Dashboard
    let user = await User.findOne({ clerkId: userId })
      .populate("followers", "name username avatar slug")
      .populate("following", "name username avatar slug");

    // UPSERT: Si el usuario existe en Clerk pero todavía no en nuestra BD de Mongo, lo creamos/sincronizamos
    if (!user) {
      const clerkUser = await currentUser();

      if (!clerkUser) {
        return NextResponse.json({ message: "Error al obtener datos de Clerk" }, { status: 500 });
      }

      const email = clerkUser.emailAddresses[0]?.emailAddress || "";
      const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Usuario sin nombre";
      const avatar = clerkUser.imageUrl || "";

      // IMPORTANTE: Antes de crear, verificamos si ya existe alguien con ese EMAIL
      // Esto sucede si el usuario borró su cuenta y volvió con el mismo email pero distinto clerkId
      user = await User.findOne({ email });

      if (user) {
        // Si existe por email, simplemente actualizamos su clerkId (vinculación)
        user.clerkId = userId;
        if (!user.avatar) user.avatar = avatar; // No sobreescribimos si ya tiene uno personalizado
        await user.save();
        console.log("Usuario vinculado por email existente:", email);
      } else {
        // Si no existe ni por clerkId ni por email, lo creamos de cero
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
      }
    } else {
      // Sincronizar Avatar en Tiempo Real al cargar el perfil
      const clerkUser = await currentUser();
      if (clerkUser && clerkUser.imageUrl && clerkUser.imageUrl !== user.avatar) {
        user.avatar = clerkUser.imageUrl;
        await user.save();
        console.log("Avatar actualizado on-the-fly desde Clerk.");
      }

      // INTEGRIDAD: Limpieza de "usuarios fantasma" (referencias a usuarios borrados manualmente o vía Clerk Dashboard)
      if ((user.following?.length > 0 || user.followers?.length > 0)) {
        // Extraemos los IDs puros (por si están populados)
        const allAssociatedIds = [...user.following, ...user.followers]
          .map(u => (u._id || u).toString());

        // Obtenemos solo los IDs que REALMENTE existen en la colección
        const validUsersInDB = await User.find({
          _id: { $in: allAssociatedIds }
        }).select("_id");

        const validIdsStrings = validUsersInDB.map(u => u._id.toString());

        const filteredFollowing = user.following.filter(u => {
          const id = (u._id || u).toString();
          return validIdsStrings.includes(id);
        });

        const filteredFollowers = user.followers.filter(u => {
          const id = (u._id || u).toString();
          return validIdsStrings.includes(id);
        });

        // Solo guardamos si realmente hemos limpiado algo (evitamos saves innecesarios)
        if (filteredFollowing.length !== user.following.length || filteredFollowers.length !== user.followers.length) {
          user.following = filteredFollowing;
          user.followers = filteredFollowers;
          await user.save();
          console.log("Limpieza de integridad completada: Se eliminaron referencias a usuarios inexistentes.");
        }
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

    const { name, username, bio, avatar, location, lat, lng } = await request.json();

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
      { $set: { name: safeName, username, bio, avatar: finalAvatar, location, lat, lng } },
      { returnDocument: 'after', runValidators: true }
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

export async function PATCH(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const updates = await request.json();
    await connectToDatabase();

    const allowedUpdates = ["username", "location", "lat", "lng", "preferences", "onboardingCompleted"];
    const filteredUpdates = {};

    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    // Si se actualiza username, sincronizar con Clerk también
    if (updates.username) {
      const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
      try {
        const cleanUsername = updates.username.startsWith("@") ? updates.username.slice(1) : updates.username;
        const clerkUsername = cleanUsername.toLowerCase().trim().replace(/\s+/g, '-');
        await clerk.users.updateUser(userId, { username: clerkUsername });
        console.log("Clerk Username Sync exitoso en PATCH:", clerkUsername);
      } catch (clerkError) {
        console.warn("Aviso: Sincronización con Clerk fallida para username en PATCH:", clerkError.message);
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar perfil parcial:", error);
    return NextResponse.json({ message: "Error al actualizar perfil" }, { status: 500 });
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

    // 1. Obtener ID y limpiar las referencias en otros usuarios (Seguidores/Siguiendo)
    const userToDelete = await User.findOne({ clerkId: userId });

    if (userToDelete) {
      const mongoId = userToDelete._id;
      // Eliminamos rastro de este usuario en las listas de seguimiento de todos los demás
      await User.updateMany(
        {},
        { $pull: { followers: mongoId, following: mongoId } }
      );

      // Eliminar el documento del usuario
      await User.findByIdAndDelete(mongoId);
      console.log(`Usuario ${userId} (${mongoId}) y sus referencias eliminados de MongoDB.`);
    }

    // 2. Eliminar de Clerk (esto disparará la desconexión del usuario)
    await clerk.users.deleteUser(userId);
    console.log(`Usuario ${userId} eliminado de Clerk manualmente.`);

    return NextResponse.json({ message: "Cuenta eliminada con éxito" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar cuenta:", error);
    return NextResponse.json({ message: "Error al eliminar la cuenta" }, { status: 500 });
  }
}

