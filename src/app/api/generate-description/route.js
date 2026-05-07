import { NextResponse } from "next/server";

// Ruta API que actúa como intermediario entre el cliente y Groq.
// Así la GROQ_API_KEY nunca queda expuesta en el bundle del navegador.
export async function POST(request) {
  try {
    const { title, categories, location, date, time } = await request.json();

    // Validación básica en el servidor
    if (!title || !categories?.length || !location || !date || !time) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios para generar la descripción." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "La clave de API de Groq no está configurada." },
        { status: 500 }
      );
    }

    // Construcción del prompt para la IA
    const prompt = `Actúa como un experto organizador de eventos y community manager. Genera una descripción atractiva, clara y que anime a participar en un meetup con los siguientes datos:

- Título: ${title}
- Categorías: ${categories.join(", ")}
- Ubicación: ${location}
- Fecha: ${date}
- Hora: ${time}

Devuelve ÚNICAMENTE el texto final de la descripción, sin introducciones, saludos, comillas ni comentarios adicionales. La descripción debe tener entre 3 y 5 frases, sonar natural y motivadora.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 512,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `Error de Groq: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data?.choices?.[0]?.message?.content?.trim();

    if (!generatedText) {
      throw new Error("La API no devolvió ningún contenido.");
    }

    return NextResponse.json({ description: generatedText });

  } catch (error) {
    console.error("Error en /api/generate-description:", error);
    return NextResponse.json(
      { error: error.message || "Error al conectar con la IA." },
      { status: 500 }
    );
  }
}
