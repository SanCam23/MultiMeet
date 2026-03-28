import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "El usuario ya existe con este correo" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Usuario creado exitosamente", user: { id: newUser._id, name: newUser.name, email: newUser.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { message: "Error al crear el usuario", error: error.message },
      { status: 500 }
    );
  }
}
