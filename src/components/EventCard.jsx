"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useTheme } from "@/context/ThemeContext";

export function EventCard({
  id,
  image,
  coverImage,
  title,
  date,
  time,
  dateTime,
  location,
  locationText,
  participants,
  participantsCount,
  category,
  categories,
  isTrending = false,
}) {
  const { theme } = useTheme();
  const isHighContrast = theme === "high-contrast";

  // Handle both mock and real DB data
  const displayImage = coverImage || image;
  const displayTitle = title;
  const displayLocation = locationText || location;
  const displayParticipants = participantsCount !== undefined ? participantsCount : (participants || 0);
  const displayCategory = categories?.[0] || category;

  let displayDate = date;
  let displayTime = time;

  if (dateTime) {
    const d = new Date(dateTime);
    displayDate = d.toLocaleDateString();
    displayTime = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <Link href={`/item/${id}`} className="block focus:outline-none focus:ring-2 focus:ring-ring rounded-2xl">
      <article className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-border">
        <div className="relative h-48">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={displayTitle}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjIyMjMzIi8+PC9zdmc+"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
              Sin imagen
            </div>
          )}
          {isTrending && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-secondary text-secondary-foreground flex items-center gap-1.5 px-3 py-1.5 shadow-lg">
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
                Tendencia
              </Badge>
            </div>
          )}
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-accent text-accent-foreground backdrop-blur-sm px-3 py-1.5">
              {displayCategory}
            </Badge>
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-semibold text-lg mb-4 line-clamp-2">{displayTitle}</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" aria-hidden="true" />
              <span>
                {displayDate} a las {displayTime}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className={`w-5 h-5 ${isHighContrast ? "text-yellow-300" : "text-secondary"}`} aria-hidden="true" />
              <span className="line-clamp-1">{displayLocation}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-accent" aria-hidden="true" />
              <span>{displayParticipants.toLocaleString()} asistentes</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
