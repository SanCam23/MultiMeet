import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongoose";
import Event from "@/models/Event";
import User from "@/models/User";

export async function GET(request) {
    try {
        const { userId: clerkId } = await auth();
        const { searchParams } = new URL(request.url);
        const tab = searchParams.get("tab") || "following";
        const radius = parseFloat(searchParams.get("radius")) || 5; // Default 5km

        await connectToDatabase();

        let user = null;
        if (clerkId) {
            user = await User.findOne({ clerkId });
        }

        let events = [];

        if (tab === "following") {
            if (!user) {
                return NextResponse.json([], { status: 200 });
            }
            // Get events from users that the current user follows, excluding self
            events = await Event.find({
                author: {
                    $in: user.following,
                    $ne: user._id
                },
                dateTime: { $gte: new Date() }
            })
                .populate("author", "name username avatar slug")
                .sort({ dateTime: 1 })
                .limit(20);
        }
        else if (tab === "topInCity") {
            if (!user || user.lat === null || user.lng === null) {
                return NextResponse.json({ error: "LOCATION_NOT_SET", message: "No tienes la ubicación definida" }, { status: 400 });
            }

            // MongoDB geospatial query (requires 2dsphere index on location or manual calculation)
            // Since Event model doesn't seem to have 2dsphere index on lat/lng yet, we use a rough bounding box or $where
            // or we can just fetch all and filter if the dataset is small, but let's try a range query

            const kmToDegrees = 1 / 111.32;
            const latDelta = radius * kmToDegrees;
            const lngDelta = radius * (kmToDegrees / Math.cos(user.lat * (Math.PI / 180)));

            events = await Event.find({
                lat: { $gte: user.lat - latDelta, $lte: user.lat + latDelta },
                lng: { $gte: user.lng - lngDelta, $lte: user.lng + lngDelta },
                dateTime: { $gte: new Date() }
            })
                .populate("author", "name username avatar slug")
                .sort({ dateTime: 1 })
                .limit(20);
        }
        else if (tab === "topGlobal") {
            events = await Event.find({
                dateTime: { $gte: new Date() }
            })
                .populate("author", "name username avatar slug")
                .sort({ maxParticipants: -1 })
                .limit(20);
        }

        return NextResponse.json(events, { status: 200 });
    } catch (error) {
        console.error("GET /api/events/home error:", error);
        return NextResponse.json(
            { error: "Error al obtener eventos del home" },
            { status: 500 }
        );
    }
}
