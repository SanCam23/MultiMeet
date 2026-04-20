"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, MapPin, Loader2, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EventCard } from "@/components/EventCard";
import { FollowButton } from "@/components/FollowButton";
import { FollowsDialog } from "@/components/FollowsDialog";
import { useTheme } from "@/context/ThemeContext";

// Helper: convierte un evento de la API al formato que espera EventCard
function mapEventToCard(ev) {
  const d = new Date(ev.dateTime);
  return {
    id: ev._id,
    image: ev.coverImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400",
    title: ev.title,
    date: d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
    location: ev.locationText,
    participants: ev.participantsCount || 0,
    category: ev.categories?.[0] || "Evento",
    dateTime: ev.dateTime,
  };
}

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const username = params?.username;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [personalEvents, setPersonalEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  
  const [isFollowsOpen, setIsFollowsOpen] = useState(false);
  const [followsType, setFollowsType] = useState("followers"); // "followers" or "following"
  
  const [mainTab, setMainTab] = useState("posts");
  const [subTab, setSubTab] = useState("personal");

  const { theme } = useTheme();
  const isHighContrast = theme === "high-contrast";

  useEffect(() => {
    async function fetchUser() {
      if (!username) return;
      setLoading(true);
      try {
        // Primero intentamos por username/slug, luego por ID como fallback
        let res = await fetch(`/api/user/username/${username}`);
        
        // Si falla por username, intentamos buscar por ID directamente
        if (!res.ok) {
          res = await fetch(`/api/user/id/${username}`);
        }
        
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setFollowersCount(data.followers?.length || 0);
          fetchUserEvents(data._id);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [username]);

  const fetchUserEvents = async (userId) => {
    setLoadingEvents(true);
    try {
      const res = await fetch(`/api/events/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setPersonalEvents(data.personal.map(mapEventToCard));
        setJoinedEvents(data.joined.map(mapEventToCard));
      }
    } catch (err) {
      console.error("Error loading user events", err);
    } finally {
      setLoadingEvents(false);
    }
  };

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

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 animate-in fade-in duration-500">
      {/* Header Back Button */}
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
        {/* Profile Info Section (Matches Dashboard) */}
        <section className="mb-8" aria-label="Perfil de usuario">
          <div className="max-w-2xl mx-auto lg:mx-0">
            <div className="flex items-start gap-5 mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-secondary/20 overflow-hidden bg-primary/10 flex-shrink-0 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-primary">{initials}</span>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">{user.name}</h2>
                <p className="text-muted-foreground text-sm mb-3">{user.username}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className={`w-4 h-4 ${isHighContrast ? "text-yellow-300" : "text-secondary"}`} aria-hidden="true" />
                  <span>{user.location || "Ubicación desconocida"}</span>
                </div>
              </div>
            </div>

            <p className="text-sm mb-6 leading-relaxed">
              {user.bio || "Este usuario aún no ha agregado una biografía."}
            </p>

            <div className="flex gap-8 mb-6">
              <button 
                onClick={() => { setFollowsType("followers"); setIsFollowsOpen(true); }}
                className="text-center hover:opacity-80 transition-opacity bg-transparent border-none p-0 cursor-pointer text-left"
              >
                <p className="text-xl font-bold text-foreground">{followersCount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Seguidores</p>
              </button>
              <button 
                onClick={() => { setFollowsType("following"); setIsFollowsOpen(true); }}
                className="text-center hover:opacity-80 transition-opacity bg-transparent border-none p-0 cursor-pointer text-left"
              >
                <p className="text-xl font-bold text-foreground">{(user.following?.length || 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Siguiendo</p>
              </button>
            </div>

            <FollowButton 
              targetId={user._id} 
              size="lg" 
              className="h-12 px-10"
              onFollowToggle={(isFollowing, count) => setFollowersCount(count)}
            />
          </div>
        </section>

        {/* Tabs and Content (Matches Dashboard) */}
        <section className="border-t border-border pt-6" aria-label="Contenido del usuario">
          {/* Main Tablist */}
          <div className="max-w-md mx-auto mb-6 md:max-w-none md:flex md:justify-center md:gap-6" role="tablist">
            <div className="grid grid-cols-2 h-12 bg-card rounded-xl p-1 w-full md:w-64 mb-4 md:mb-0">
              <button
                role="tab"
                aria-selected={mainTab === "posts"}
                onClick={() => { setMainTab("posts"); setSubTab("personal"); }}
                className={`rounded-lg transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                  mainTab === "posts"
                    ? `bg-primary ${isHighContrast ? "text-black" : "text-primary-foreground"} shadow-sm`
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Eventos
              </button>
              <button
                role="tab"
                aria-selected={mainTab === "timeline"}
                onClick={() => { setMainTab("timeline"); setSubTab("upcoming"); }}
                className={`rounded-lg transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                  mainTab === "timeline"
                    ? `bg-primary ${isHighContrast ? "text-black" : "text-primary-foreground"} shadow-sm`
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Historial
              </button>
            </div>

            {/* Sub Tablist */}
            <div className="grid grid-cols-2 h-11 bg-card rounded-lg p-0.5 w-full md:w-56" role="tablist">
              {mainTab === "posts" ? (
                <>
                  <button
                    role="tab"
                    aria-selected={subTab === "personal"}
                    onClick={() => setSubTab("personal")}
                    className={`rounded-md transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                      subTab === "personal"
                        ? `bg-accent ${isHighContrast ? "text-black" : "text-accent-foreground"} shadow-sm`
                        : "text-muted-foreground"
                    }`}
                  >
                    Creados
                  </button>
                  <button
                    role="tab"
                    aria-selected={subTab === "joined"}
                    onClick={() => setSubTab("joined")}
                    className={`rounded-md transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                      subTab === "joined"
                        ? `bg-accent ${isHighContrast ? "text-black" : "text-accent-foreground"} shadow-sm`
                        : "text-muted-foreground"
                    }`}
                  >
                    Apuntado
                  </button>
                </>
              ) : (
                <>
                  <button
                    role="tab"
                    aria-selected={subTab === "upcoming"}
                    onClick={() => setSubTab("upcoming")}
                    className={`rounded-md transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                      subTab === "upcoming"
                        ? `bg-accent ${isHighContrast ? "text-black" : "text-accent-foreground"} shadow-sm`
                        : "text-muted-foreground"
                    }`}
                  >
                    Próximos
                  </button>
                  <button
                    role="tab"
                    aria-selected={subTab === "past"}
                    onClick={() => setSubTab("past")}
                    className={`rounded-md transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                      subTab === "past"
                        ? `bg-accent ${isHighContrast ? "text-black" : "text-accent-foreground"} shadow-sm`
                        : "text-muted-foreground"
                    }`}
                  >
                    Pasados
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Event Grid */}
          {loadingEvents ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : mainTab === "posts" && subTab === "personal" && personalEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Aún no ha creado eventos</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">Este usuario no ha organizado ningún meetup todavía.</p>
            </div>
          ) : mainTab === "posts" && subTab === "joined" && joinedEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No está apuntado a eventos</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">Este usuario no se ha unido a ningún evento público recientemente.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8 mt-6">
              {(mainTab === "posts" && subTab === "personal" ? personalEvents :
                mainTab === "posts" && subTab === "joined" ? joinedEvents :
                mainTab === "timeline" && subTab === "upcoming" ? joinedEvents.filter(e => new Date(e.dateTime) >= new Date()) :
                joinedEvents.filter(e => new Date(e.dateTime) < new Date())).map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          )}
        </section>

        {/* Follows Dialog (Readonly) */}
        <FollowsDialog
          open={isFollowsOpen}
          onOpenChange={setIsFollowsOpen}
          type={followsType}
          list={followsType === "followers" ? user.followers : user.following}
          readonly={true}
        />
      </div>
    </div>
  );
}

