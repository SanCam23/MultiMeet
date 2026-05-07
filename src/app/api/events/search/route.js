import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Event from "@/models/Event";
import User from "@/models/User"; // Add user to avoid MissingSchemaError

/**
 * GET /api/events/search
 * Filtros soportados por query string:
 * - q: texto libre (titulo, descripcion, ubicacion)
 * - categories: lista separada por coma (Tech,Music)
 * - location: texto libre para locationText
 * - startDate: YYYY-MM-DD
 * - endDate: YYYY-MM-DD
 * - minParticipants: numero minimo de asistentes
 * - status: active|finished|cancelled (por defecto active)
 * - limit: limite de resultados (max 100, por defecto 60)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q")?.trim() || "";
    const location = searchParams.get("location")?.trim() || "";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const minParticipantsRaw = searchParams.get("minParticipants");
    const status = (searchParams.get("status") || "").trim();

    const categoriesParam =
      searchParams.get("categories") || searchParams.getAll("category").join(",");
    const categories = categoriesParam
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const requestedLimit = Number.parseInt(searchParams.get("limit") || "60", 10);
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), 100)
      : 60;

    const minParticipants = Number.parseInt(minParticipantsRaw || "", 10);

    const query = {};

    if (status && ["active", "finished", "cancelled"].includes(status)) {
      query.status = status;
    } else {
      // Por defecto muestra eventos activos y finalizados
      query.status = { $in: ["active", "finished"] };
    }

    if (categories.length > 0) {
      query.categories = { $in: categories };
    }

    if (location) {
      query.locationText = { $regex: location, $options: "i" };
    }

    if (Number.isFinite(minParticipants)) {
      query.participantsCount = { $gte: Math.max(minParticipants, 0) };
    }

    if (startDate || endDate) {
      query.dateTime = {};

      if (startDate) {
        const parsedStartDate = new Date(startDate);
        if (!Number.isNaN(parsedStartDate.getTime())) {
          query.dateTime.$gte = parsedStartDate;
        }
      }

      if (endDate) {
        const parsedEndDate = new Date(endDate);
        if (!Number.isNaN(parsedEndDate.getTime())) {
          parsedEndDate.setHours(23, 59, 59, 999);
          query.dateTime.$lte = parsedEndDate;
        }
      }

      if (Object.keys(query.dateTime).length === 0) {
        delete query.dateTime;
      }
    }

    if (q) {
      // Escapamos caracteres especiales de regex y creamos un patrón tolerante a tildes
      const safeQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const flexibleQ = safeQ
        .replace(/[aAáÁàÀäÄâÂ]/g, "[aAáÁàÀäÄâÂ]")
        .replace(/[eEéÉèÈëËêÊ]/g, "[eEéÉèÈëËêÊ]")
        .replace(/[iIíÍìÌïÏîÎ]/g, "[iIíÍìÌïÏîÎ]")
        .replace(/[oOóÓòÒöÖôÔ]/g, "[oOóÓòÒöÖôÔ]")
        .replace(/[uUúÚùÙüÜûÛ]/g, "[uUúÚùÙüÜûÛ]");

      query.$or = [
        { title: { $regex: flexibleQ, $options: "i" } },
        { description: { $regex: flexibleQ, $options: "i" } },
        { locationText: { $regex: flexibleQ, $options: "i" } },
        { categories: { $regex: flexibleQ, $options: "i" } },
      ];
    }

    await connectToDatabase();

    const events = await Event.find(query)
      .populate("author", "name username avatar slug")
      .sort({ dateTime: 1, createdAt: -1 })
      .limit(limit);

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("GET /api/events/search error:", error);
    return NextResponse.json(
      { error: "No se pudieron buscar eventos" },
      { status: 500 }
    );
  }
}
