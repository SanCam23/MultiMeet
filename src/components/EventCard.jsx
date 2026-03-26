"use client";

import Link from "next/link";
import { Calendar, MapPin, Users, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function EventCard({
  id,
  image,
  title,
  date,
  time,
  location,
  participants,
  category,
  isTrending = false,
}) {
  return (
    <Link href={`/item/${id}`} className="block focus:outline-none focus:ring-2 focus:ring-ring rounded-2xl">
      <article className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-border">
        <div className="relative h-48">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
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
              {category}
            </Badge>
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-semibold text-lg mb-4 line-clamp-2">{title}</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" aria-hidden="true" />
              <span>
                {date} a las {time}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-secondary" aria-hidden="true" />
              <span className="line-clamp-1">{location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-accent" aria-hidden="true" />
              <span>{participants.toLocaleString()} asistentes</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
