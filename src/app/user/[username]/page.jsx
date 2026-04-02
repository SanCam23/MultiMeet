"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Calendar, Users, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { EventCard } from "@/components/EventCard";
import { FollowButton } from "@/components/FollowButton";
import { getEventById } from "@/data/events";
import { useTheme } from "@/context/ThemeContext";

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const { theme } = useTheme();
  const isHighContrast = theme === "high-contrast";

  const username = params?.username;

  useEffect(() => {
    async function fetchUser() {
      if (!username) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/user/username/${username}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setFollowersCount(data.followers?.length || 0);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Cargando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Usuario no encontrado</h2>
          <p className="text-muted-foreground mb-4">El perfil que buscas no existe o ha sido eliminado.</p>
          <Button onClick={() => router.push("/")}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const createdEvents = (user.createdEvents || [])
    .map((id) => getEventById(id))
    .filter(Boolean);

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

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
              <div className="w-24 h-24 rounded-full border-4 border-secondary/20 overflow-hidden flex-shrink-0 bg-muted">
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div
                className="w-24 h-24 rounded-full border-4 border-secondary/20 flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold bg-primary"
              >
                {initials}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{user.name}</h2>
              <p className="text-muted-foreground text-sm mb-3">{user.username}</p>
              {user.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className={`w-4 h-4 ${isHighContrast ? "text-yellow-300" : "text-secondary"}`} />
                  <span>{user.location}</span>
                </div>
              )}
            </div>
          </div>

          {user.bio && <p className="text-sm mb-6 leading-relaxed text-balance">{user.bio}</p>}

          <div className="flex gap-8 mb-6">
            <div className="text-left">
              <p className="text-xl font-bold text-foreground">{followersCount.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Seguidores</p>
            </div>
            <div className="text-left">
              <p className="text-xl font-bold text-foreground">{(user.following?.length || 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Siguiendo</p>
            </div>
          </div>

          <FollowButton 
            targetId={user._id} 
            size="lg" 
            className="h-12 px-10"
            onFollowToggle={(isFollowing, count) => setFollowersCount(count)}
          />
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
