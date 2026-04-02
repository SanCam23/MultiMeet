import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import { mockPublicUsers } from "@/data/events";

/**
 * API solo para desarrollo que sincroniza los usuarios del frontend (JSON) 
 * con la base de datos MongoDB.
 */
export async function GET() {
  // Comprobamos que no sea producción (opcional, depende de tu flujo)
  // if (process.env.NODE_ENV === 'production') return NextResponse.json({error: 'Forbidden'}, {status: 403});

  try {
    await connectToDatabase();
    const results = [];

    for (const slug in mockPublicUsers) {
      const mockUser = mockPublicUsers[slug];
      
      // Búsqueda insensible a mayúsculas
      let user = await User.findOne({ 
        $or: [
          { slug: { $regex: new RegExp(`^${slug}$`, 'i') } },
          { username: { $regex: new RegExp(`^${mockUser.username}$`, 'i') } }
        ]
      });

      if (!user) {
        user = await User.create({
          clerkId: `dev_mock_${slug}_${Date.now()}`, 
          email: `${slug}@example.com`,
          name: mockUser.name,
          username: mockUser.username,
          slug: slug, 
          avatar: mockUser.avatar || "",
          bio: mockUser.bio || "",
          location: mockUser.location || "",
          followers: [],
          following: []
        });
        results.push({ username: mockUser.username, slug: slug, status: "created", id: user._id });
      } else {
        user.slug = slug;
        if (!user.username) user.username = mockUser.username;
        await user.save();
        results.push({ username: mockUser.username, slug: slug, status: "updated", id: user._id });
      }
    }

    return NextResponse.json({ 
      message: "Sincronización de usuarios de prueba completada",
      results 
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
