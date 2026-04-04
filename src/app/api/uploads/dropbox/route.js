import { NextResponse } from "next/server";
import { uploadBufferToDropbox } from "@/lib/dropbox";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Debes enviar un archivo de imagen" },
        { status: 400 }
      );
    }

    if (!file.type?.startsWith("image/")) {
      return NextResponse.json(
        { error: "El archivo debe ser una imagen" },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "La imagen supera el límite de 5MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadedFile = await uploadBufferToDropbox({
      buffer,
      fileName: file.name || "event-cover.jpg",
    });

    return NextResponse.json(uploadedFile, { status: 201 });
  } catch (error) {
    console.error("Dropbox upload error:", error);
    return NextResponse.json(
      { error: error.message || "Error al subir la imagen a Dropbox" },
      { status: 500 }
    );
  }
}