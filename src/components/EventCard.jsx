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
  status,
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

  const isFinished = status === "finished";

  return (
    <Link href={`/item/${id}`} className="block h-full focus:outline-none focus:ring-2 focus:ring-ring rounded-2xl">
      <article className={`h-full flex flex-col bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border ${isHighContrast ? "border-primary border-4" : "border-border"} ${isFinished ? "opacity-75 grayscale-[0.5]" : ""}`}>
        <div className="relative h-48 shrink-0">
          {displayImage ? (
            (displayImage.split('?')[0].toLowerCase().endsWith('.mp4') || displayImage.split('?')[0].toLowerCase().endsWith('.webm')) ? (
              <video
                src={displayImage}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <Image
                src={displayImage}
                alt={displayTitle}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjIyMjMzIi8+PC9zdmc+"
                unoptimized={displayImage.includes("dropbox.com") || displayImage.includes("unsplash.com") || displayImage.includes("images.unsplash.com")}
              />
            )
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
              Sin imagen
            </div>
          )}

          {/* Dark Overlay - Solo para eventos finalizados */}
          {isFinished && (
            <div className="absolute inset-0 bg-black/40 pointer-events-none z-0" />
          )}


          {/* Status Badge */}
          {isFinished ? (
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-destructive text-destructive-foreground px-3 py-1.5 shadow-lg font-bold">
                FINALIZADO
              </Badge>
            </div>
          ) : isTrending && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-secondary text-secondary-foreground flex items-center gap-1.5 px-3 py-1.5 shadow-lg">
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
                Tendencia
              </Badge>
            </div>
          )}

          {!isFinished && (
            <div className="absolute bottom-4 left-4">
              <Badge className="bg-accent text-accent-foreground backdrop-blur-sm px-3 py-1.5">
                {displayCategory}
              </Badge>
            </div>
          )}
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <h3 className={`font-semibold text-lg mb-4 line-clamp-2 ${isFinished ? "text-muted-foreground" : isHighContrast ? "text-primary" : theme === "dark" ? "text-white" : "text-primary"}`}>{displayTitle}</h3>
          <div className={`space-y-3 text-sm mt-auto ${isHighContrast ? "text-white" : "text-muted-foreground"}`}>
            <div className="flex items-center gap-3">
              <Calendar className={`w-5 h-5 ${isFinished ? "text-muted-foreground" : isHighContrast ? "text-white" : "text-primary"}`} aria-hidden="true" />
              <span>
                {displayDate} a las {displayTime}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className={`w-5 h-5 ${isFinished ? "text-muted-foreground" : isHighContrast ? "text-white" : "text-secondary"}`} aria-hidden="true" />
              <span className="line-clamp-1">{displayLocation}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className={`w-5 h-5 ${isFinished ? "text-muted-foreground" : isHighContrast ? "text-white" : "text-accent"}`} aria-hidden="true" />
              <span>{displayParticipants.toLocaleString()} asistentes</span>
            </div>
          </div>
        </div>

      </article>
    </Link>
  );
}

