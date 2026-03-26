"use client";

import { useState } from "react";
import { ArrowLeft, MapPin, UserPlus, UserCheck, Calendar, Users } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { EventCard } from "@/components/EventCard";
import { mockPublicUsers, getEventById } from "@/data/events";
import { useTheme } from "@/context/ThemeContext";

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const { theme } = useTheme();
  const isHighContrast = theme === "high-contrast";

  const username = params?.username;
  const user = mockPublicUsers[username];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Usuario no encontrado</h2>
          <p className="text-muted-foreground mb-4">El perfil que buscas no existe.</p>
          <Button onClick={() => router.push("/")}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const createdEvents = (user.createdEvents || [])
    .map((id) => getEventById(id))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="px-6 py-5 flex items-center gap-4 max-w-[1440px] mx-auto">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted/50 rounded-full transition-colors"
            aria-label="Volver atrás"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">{user.name}</h1>
        </div>
      </div>

      <div className="w-full mx-auto px-6 md:px-8 lg:px-12 py-8 max-w-[1440px]">
        {/* Profile Info */}
        <div className="max-w-2xl mx-auto lg:mx-0">
          <div className="flex items-start gap-5 mb-6">
            {user.avatar ? (
              <div className="w-24 h-24 rounded-full border-4 border-secondary/20 overflow-hidden flex-shrink-0">
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div
                className="w-24 h-24 rounded-full border-4 border-secondary/20 flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: user.avatarColor }}
              >
                {user.initials}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{user.name}</h2>
              <p className="text-muted-foreground text-sm mb-3">{user.username}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className={`w-4 h-4 ${isHighContrast ? "text-yellow-300" : "text-secondary"}`} />
                <span>{user.location}</span>
              </div>
            </div>
          </div>

          <p className="text-sm mb-6 leading-relaxed">{user.bio}</p>

          <div className="flex gap-8 mb-6">
            <button className="text-center hover:opacity-80 transition-opacity">
              <p className="text-xl font-bold text-foreground">{user.followers.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Seguidores</p>
            </button>
            <button className="text-center hover:opacity-80 transition-opacity">
              <p className="text-xl font-bold text-foreground">{user.following.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Siguiendo</p>
            </button>
          </div>

          <Button
            onClick={() => setIsFollowing(!isFollowing)}
            variant={isFollowing ? "outline" : "default"}
            className="h-12 rounded-xl px-8"
          >
            {isFollowing ? (
              <>
                <UserCheck className="w-5 h-5 mr-2" />
                Siguiendo
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Seguir
              </>
            )}
          </Button>
        </div>

        {/* Created Events */}
        {createdEvents.length > 0 && (
          <div className="mt-10">
            <h3 className="font-semibold text-lg mb-6">Eventos creados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8">
              {createdEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
