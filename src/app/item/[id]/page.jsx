"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, MapPin, Calendar, Users, Share2, Link as LinkIcon, UserPlus, UserCheck, Upload, Star, Trash2, Video } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import Masonry from "react-responsive-masonry";
import { PreviousEditions } from "@/components/PreviousEditions";
import { StarRating } from "@/components/StarRating";
import { useTheme } from "@/context/ThemeContext";
import { FollowButton } from "@/components/FollowButton";
import { useAuth, useClerk } from "@clerk/nextjs";

export default function ItemDetailPage() {
  const { userId } = useAuth();
  const { openSignIn } = useClerk();
  const router = useRouter();
  const params = useParams();
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [rating, setRating] = useState(0);
  const [activeTab, setActiveTab] = useState("gallery");
  const { theme } = useTheme();
  const isHighContrast = theme === "high-contrast";

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userJoined, setUserJoined] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  
  const fileInputRef = useRef(null);

  const urlId = params?.id;

  useEffect(() => {
    if (!urlId) return;
    fetch(`/api/events/${urlId}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        setEvent(data);
        if (userId) {
          setIsAuthor(data.author?.clerkId === userId);
          setUserJoined(data.participants?.some(p => p.clerkId === userId) || false);
          
          const myRating = data.ratings?.find(r => r.user?.clerkId === userId);
          if (myRating) setRating(myRating.value);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [urlId, userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando evento...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Evento no encontrado</h2>
          <p className="text-muted-foreground mb-4">El evento que buscas no existe o ha sido eliminado.</p>
          <Button onClick={() => router.push("/")}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const isFinished = event.status === "finished";
  const hasGallery = event.userGallery && event.userGallery.length > 0;
  
  const handleShare = () => {
    setShowSharePopup(true);
    setTimeout(() => setShowSharePopup(false), 2500);
  };

  const handleJoinOrFinish = async () => {
    if (!userId) {
      openSignIn();
      return;
    }
    
    if (isAuthor && !isFinished) {
      if (!confirm("¿Seguro que deseas finalizar el evento?")) return;
      try {
        const res = await fetch(`/api/events/${urlId}/finish`, {
          method: "POST"
        });
        if (res.ok) {
          setEvent({ ...event, status: "finished" });
        }
      } catch (e) {
        console.error(e);
      }
      return;
    }

    if (isFinished) return;

    try {
      const res = await fetch(`/api/events/${urlId}/join`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        setUserJoined(data.joined);
        setEvent({ ...event, participantsCount: data.participantsCount });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadMedia = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const uploadRes = await fetch("/api/uploads/dropbox", {
        method: "POST",
        body: formData
      });
      
      if (!uploadRes.ok) throw new Error("Error al subir archivo");
      const { url } = await uploadRes.json();
      
      const galleryRes = await fetch(`/api/events/${urlId}/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, type: file.type.startsWith("video/") ? "video" : "image" })
      });
      
      if (galleryRes.ok) {
        const data = await galleryRes.json();
        setEvent({ ...event, userGallery: data.userGallery });
      }
    } catch (error) {
      console.error(error);
      alert("Error al subir el archivo");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerUpload = () => {
    if (!userId) {
      openSignIn();
      return;
    }
    fileInputRef.current?.click();
  };

  const handleRatingSubmit = async () => {
    if (!userId) {
      openSignIn();
      return;
    }
    if (rating > 0) {
      try {
        const res = await fetch(`/api/events/${urlId}/rating`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating })
        });
        if (res.ok) {
          alert(`¡Gracias! Has valorado el evento con ${rating} estrellas.`);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getEventDateText = () => {
    if (event.dateTime) {
      const d = new Date(event.dateTime);
      return `${d.toLocaleDateString()} a las ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="relative h-72 md:h-96 w-full">
        <img src={event.coverImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1080"} 
             alt="" className="w-full h-full object-cover bg-muted" />

        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 bg-card/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-card transition-colors"
          aria-label="Volver atrás"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>

        <button
          onClick={handleShare}
          className="absolute top-6 right-6 bg-card/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-card transition-colors"
          aria-label="Compartir evento"
        >
          <Share2 className="w-6 h-6 text-foreground" />
        </button>

        {showSharePopup && (
          <div className="absolute top-20 right-6 flex items-center gap-2.5 bg-card border border-border rounded-2xl px-4 py-3 shadow-xl">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10">
              <LinkIcon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">
              Enlace compartido correctamente
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="w-full mx-auto px-6 md:px-8 lg:px-12 py-8 max-w-[1000px]">
        {/* Title & Badges */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{event.title}</h1>
          <div className="flex flex-wrap gap-2">
            {event.categories?.map((cat, i) => (
              <Badge key={i} className="bg-accent text-accent-foreground px-4 py-2 rounded-full">
                {cat}
              </Badge>
            ))}
            {isFinished && (
              <Badge className="bg-muted text-muted-foreground px-4 py-2 rounded-full">
                Finalizado
              </Badge>
            )}
          </div>
        </div>

        {/* Author Card */}
        {event.author && (
          <div className="flex items-center gap-3 bg-card rounded-2xl px-5 py-4 mb-8 border border-border shadow-sm">
            <Link href={`/user/${event.author.slug}`}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold cursor-pointer hover:opacity-80 transition-opacity bg-primary"
              >
                {event.author.name?.substring(0, 2).toUpperCase()}
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">Organizado por</p>
              <Link href={`/user/${event.author.slug}`} className="font-semibold text-sm truncate block hover:text-primary transition-colors">
                {event.author.name}
              </Link>
            </div>
            {(!userId || userId !== event.author.clerkId) && (
              <FollowButton targetUsername={event.author.slug} className="px-6 py-2" />
            )}
          </div>
        )}

        {/* Event Info Card */}
        <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-md space-y-6 mb-8">
          <div className="flex items-start gap-4">
            <Calendar className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-1">Fecha y hora</p>
              <p className="text-sm text-muted-foreground">
                {getEventDateText()}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin className={`w-6 h-6 mt-0.5 flex-shrink-0 ${isHighContrast ? "text-yellow-300" : "text-secondary"}`} />
            <div className="flex-1">
              <p className="font-semibold mb-1">Ubicación</p>
              <p className="text-sm text-muted-foreground">{event.locationText}</p>
            </div>
          </div>

          <div className="h-40 md:h-48 bg-muted rounded-xl overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
              <MapPin className={`w-12 h-12 ${isHighContrast ? "text-yellow-300/40" : "text-secondary/40"}`} />
            </div>
          </div>

          <button
            onClick={() => alert("Mostrando lista de participantes (Próximamente)...")}
            className="flex items-center gap-4 w-full pt-2 hover:bg-muted/30 -mx-6 px-6 md:-mx-8 md:px-8 py-4 rounded-xl transition-colors"
          >
            <Users className="w-6 h-6 text-accent flex-shrink-0" />
            <div className="text-left">
              <p className="font-semibold">Participantes</p>
              <p className="text-sm text-muted-foreground">
                {event.participantsCount || 0} personas apuntadas
              </p>
            </div>
          </button>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-3">Sobre este evento</h3>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.description}</p>
        </div>

        {/* CTA Section */}
        {!isFinished ? (
          <Button 
            onClick={handleJoinOrFinish} 
            variant={isAuthor ? 'destructive' : userJoined ? 'outline' : 'default'}
            className="w-full md:max-w-md md:mx-auto md:block h-14 text-base rounded-xl shadow-lg mb-8" 
            size="lg"
          >
            {isAuthor ? "Finalizar evento" : userJoined ? "Desapuntarse" : "Unirse al evento"}
          </Button>
        ) : (
          <>
            {/* Rating Section */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-md mb-8 max-w-md mx-auto">
              <h3 className="font-semibold text-lg mb-6 text-center">Valora este evento</h3>
              <div className="flex flex-col items-center gap-6">
                <StarRating value={rating} onChange={setRating} />
                <Button
                  onClick={handleRatingSubmit}
                  disabled={rating === 0}
                  className="w-full h-14 text-base rounded-xl"
                >
                  Enviar valoración
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Gallery Section */}
        {(isFinished || hasGallery) && (
          <div className="mb-8 mt-12 border-t border-border pt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Galería del evento</h3>
              <span className="text-sm text-muted-foreground">
                {event.userGallery?.length || 0} elementos
              </span>
            </div>

            {isFinished && (
              <div className="mb-6">
                <input 
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleUploadMedia}
                />
                <Button
                  onClick={triggerUpload}
                  variant="outline"
                  className="w-full md:w-auto h-12 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Añadir fotos
                </Button>
              </div>
            )}

            {hasGallery && (
              <Masonry columnsCount={2} gutter="16px">
                {event.userGallery.map((item, index) => {
                  const url = item.url;
                  
                  return (
                    <div key={index} className="relative rounded-2xl overflow-hidden group shadow-md bg-card border border-border">
                      <div className="relative">
                        <img src={url} alt={`Subido por ${item.user?.username}`} className="w-full h-auto object-cover" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{item.user?.name || item.user?.username}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Masonry>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
