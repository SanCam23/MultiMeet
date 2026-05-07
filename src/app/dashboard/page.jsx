"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Settings, MapPin, Loader2, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EventCard } from "@/components/EventCard";
import { SettingsDialog } from "@/components/SettingsDialog";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { FollowsDialog } from "@/components/FollowsDialog";
import { useTheme } from "@/context/ThemeContext";

import { Show, SignInButton } from "@clerk/nextjs";
import { UserCircle } from "lucide-react";

// Usaremos un fetch a la BD en lugar de este mock estático.
// Se dejan en cero los seguidores temporales hasta tener la colección Follows.

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

// Mock data removed in favor of real API data
const mockPastEventsPlaceholder = [
  {
    id: "empty",
    title: "Sin eventos pasados",
    date: "-",
    time: "-",
    location: "-",
    participants: 0,
    category: "-",
    image: "https://images.unsplash.com/photo-1672841821756-fc04525771c2?w=400"
  },
];

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mainTab, setMainTab] = useState("posts");
  const [subTab, setSubTab] = useState("personal");
  const [personalEvents, setPersonalEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loadingPersonal, setLoadingPersonal] = useState(true);
  const [loadingJoined, setLoadingJoined] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isFollowsOpen, setIsFollowsOpen] = useState(false);
  const [followsType, setFollowsType] = useState("followers"); // "followers" or "following"
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { theme } = useTheme();
  const isHighContrast = theme === "high-contrast";

  useEffect(() => {
    if (searchParams.get("edit") === "true") {
      setIsEditProfileOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
        }
      } catch (err) {
        console.error("Error cargando perfil", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Cargar eventos personales y apuntados del usuario
  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await fetch("/api/events/my");
        if (res.ok) {
          const data = await res.json();
          setPersonalEvents(data.map(mapEventToCard));
        }
      } catch (err) {
        console.error("Error cargando eventos personales", err);
      } finally {
        setLoadingPersonal(false);
      }
    };

    const fetchJoinedEvents = async () => {
      try {
        const res = await fetch("/api/events/joined");
        if (res.ok) {
          const data = await res.json();
          setJoinedEvents(data.map(mapEventToCard));
        }
      } catch (err) {
        console.error("Error cargando eventos apuntados", err);
      } finally {
        setLoadingJoined(false);
      }
    };

    fetchMyEvents();
    fetchJoinedEvents();
  }, []);

  const refreshProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    } catch (err) {
      console.error("Error al refrescar perfil", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const handleSaveSuccess = (updated) => {
    setUserData(updated);
    // Disparamos un refresco del router para que el layout y Clerk se enteren del cambio inmediatamente
    router.refresh();
  };

  return (
    <>
      <Show when="signed-in">
        {userData ? (
          <div className="min-h-screen bg-background pb-8 animate-in fade-in duration-500">
            {/* Profile Header */}
            <section className="bg-card border-b border-border" aria-label="Perfil de usuario">
              <div className="w-full mx-auto px-6 md:px-8 lg:px-12 py-8 max-w-[1440px]">
                <div className="max-w-2xl mx-auto lg:mx-0">
                  <div className="flex items-start gap-5 mb-6">
                    <div className="w-24 h-24 rounded-full border-4 border-secondary/20 overflow-hidden bg-primary/10 flex-shrink-0 flex items-center justify-center">
                      {userData.avatar ? (
                        <img 
                          key={userData.avatar} 
                          src={`${userData.avatar}${userData.avatar.includes('?') ? '&' : '?'}v=${new Date().getTime()}`} 
                          alt={userData.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="text-3xl font-bold text-primary">{userData.name?.[0]?.toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-1">{userData.name}</h2>
                      <p className="text-muted-foreground text-sm mb-3">
                        {userData.username || "@" + userData.name.toLowerCase().replace(/\s/g, '')}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className={`w-4 h-4 ${isHighContrast ? "text-yellow-300" : "text-secondary"}`} aria-hidden="true" />
                        <span>{userData.location || "Ubicación desconocida"}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm mb-6 leading-relaxed">
                    {userData.bio || "Agrega una descripción para contarle más a tu comunidad sobre ti."}
                  </p>

                  <div className="flex gap-8 mb-6">
                    <button 
                      onClick={() => { setFollowsType("followers"); setIsFollowsOpen(true); }}
                      className="text-center hover:opacity-80 transition-opacity bg-transparent border-none p-0 cursor-pointer"
                    >
                      <p className="text-xl font-bold text-foreground">
                        {(userData.followers?.length || 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Seguidores</p>
                    </button>
                    <button 
                      onClick={() => { setFollowsType("following"); setIsFollowsOpen(true); }}
                      className="text-center hover:opacity-80 transition-opacity bg-transparent border-none p-0 cursor-pointer"
                    >
                      <p className="text-xl font-bold text-foreground">
                        {(userData.following?.length || 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Siguiendo</p>
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 md:flex-initial md:px-8 h-12 rounded-xl" onClick={() => setIsEditProfileOpen(true)}>
                      Editar perfil
                    </Button>
                    <Button variant="outline" size="icon" aria-label="Ajustes" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
                      <Settings className="w-5 h-5 text-primary" />
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Settings Modals */}
            <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
            
            <EditProfileDialog 
              open={isEditProfileOpen} 
              onOpenChange={setIsEditProfileOpen} 
              userData={userData}
              onSaveSuccess={handleSaveSuccess}
            />

            <FollowsDialog
              open={isFollowsOpen}
              onOpenChange={setIsFollowsOpen}
              type={followsType}
              list={followsType === "followers" ? userData.followers : userData.following}
              onRefresh={refreshProfile}
            />

            {/* Tabs and Content */}
            <section className="w-full mx-auto px-6 md:px-8 lg:px-12 pt-6 pb-8 max-w-[1440px]" aria-label="Contenido del usuario">
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
                    Mis eventos
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
                        Personal
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
              {/* Contenido del tab activo */}
              {((mainTab === "posts" && subTab === "personal" && loadingPersonal) || 
                (mainTab === "posts" && subTab === "joined" && loadingJoined) ||
                (mainTab === "timeline" && loadingJoined)) ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : mainTab === "posts" && subTab === "personal" && personalEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Calendar className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Aún no has creado eventos</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm">¡Publica tu primer evento y empieza a conectar con tu comunidad!</p>
                  <Button onClick={() => router.push("/upload")} className="rounded-xl px-8 h-12 text-base">
                    Crear evento
                  </Button>
                </div>
              ) : mainTab === "posts" && subTab === "joined" && joinedEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No estás apuntado a ningún evento</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm">¡Explora la página principal y apúntate a los que te interesen!</p>
                  <Button onClick={() => router.push("/")} className="rounded-xl px-8 h-12 text-base">
                    Explorar eventos
                  </Button>
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
          </div>
        ) : (
          <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Sincronizando perfil...</p>
          </div>
        )}
      </Show>

      <Show when="signed-out">
        <div className="min-h-screen bg-background flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
            <UserCircle className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">¡Tu perfil te espera!</h1>
          <p className="text-muted-foreground mb-10 max-w-sm text-lg leading-relaxed">
            Inicia sesión para ver tu actividad, personalizar tu perfil y conectar con meetups de tu comunidad.
          </p>
          <SignInButton mode="modal">
            <Button size="lg" className="rounded-2xl px-12 h-16 text-lg shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 bg-primary text-primary-foreground font-bold">
              Iniciar Sesión ahora
            </Button>
          </SignInButton>
        </div>
      </Show>
    </>
  );
}

import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
