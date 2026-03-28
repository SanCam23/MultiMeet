import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Buscar al usuario y pedir explícitamente la contraseña
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Comparar la contraseña ingresada con el hash de la base de datos
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Generar un JWT Token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET || "default_secret_key_multimeet",
      { expiresIn: "7d" }
    );

    // Crear la respuesta indicando que fue exitoso
    const response = NextResponse.json(
      { message: "Inicio de sesión exitoso", user: { id: user._id, name: user.name, email: user.email } },
      { status: 200 }
    );

    // Añadir el token en una cookie segura HttpOnly
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { message: "Error al iniciar sesión", error: error.message },
      { status: 500 }
    );
  }
}
