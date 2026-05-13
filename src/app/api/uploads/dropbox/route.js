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

    if (!file.type?.startsWith("image/") && !file.type?.startsWith("video/")) {
      return NextResponse.json(
        { error: "El archivo debe ser una imagen o un vídeo" },
        { status: 400 }
      );
    }

    const maxSize = file.type?.startsWith("video/") ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `El archivo supera el límite de ${file.type?.startsWith("video/") ? "100MB" : "10MB"}` },
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