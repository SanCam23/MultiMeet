"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, MapPin, Calendar, Users, Share2, Link as LinkIcon, UserPlus, UserCheck, Upload, Star, Trash2, Video, X } from "lucide-react";
import Image from "next/image";
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
import dynamic from "next/dynamic";

const MapViewer = dynamic(() => import("@/components/MapViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center animate-pulse">
      <MapPin className="w-12 h-12 text-secondary/40" />
    </div>
  ),
});

export default function ItemDetailPage() {
  const { userId } = useAuth();
  const { openSignIn } = useClerk();
  const router = useRouter();
  const params = useParams();
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [rating, setRating] = useState(0);
  const [activeTab, setActiveTab] = useState("gallery");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(false);
  const [deleteError, setDeleteError] = useState("");
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

  const handleDeleteEvent = async () => {
    try {
      setDeletingEvent(true);
      setDeleteError("");

      const res = await fetch(`/api/events/${urlId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "No se pudo eliminar el evento");
      }

      setShowDeleteModal(false);
      router.push("/dashboard");
    } catch (error) {
      setDeleteError(error.message || "No se pudo eliminar el evento");
    } finally {
      setDeletingEvent(false);
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
        <Image
          src={event.coverImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1080"}
          alt={event.title || "Evento"}
          fill
          sizes="100vw"
          className="object-cover bg-muted"
          priority
        />

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

        {/* Parent Event Linking */}
        {event.parentEvent && (
          <Link href={`/item/${event.parentEvent._id}`}>
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-8 relative overflow-hidden group transition-all hover:bg-primary/10 flex items-center gap-4 shadow-sm">
               {event.parentEvent.coverImage ? (
                 <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-background">
                    <img src={event.parentEvent.coverImage} className="w-full h-full object-cover" alt="" />
                 </div>
               ) : (
                 <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-8 h-8 text-primary/50" />
                 </div>
               )}
               <div className="flex-1">
                 <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">Viene del meetup</p>
                 <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{event.parentEvent.title}</p>
                 <p className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">Ver evento original</p>
               </div>
               <ArrowRight className="w-5 h-5 text-primary opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        )}

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
              <FollowButton targetId={event.author._id} className="px-6 py-2" />
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

          <div className="h-40 md:h-48 bg-muted rounded-xl overflow-hidden relative group">
            {event.lat && event.lng ? (
              <>
                <MapViewer lat={event.lat} lng={event.lng} />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${event.lat},${event.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 focus-within:bg-black/20 hover:bg-black/20 transition-all cursor-pointer"
                  title="Abrir en Google Maps"
                >
                  <div className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 bg-background/95 backdrop-blur-sm text-foreground px-4 py-2 rounded-full font-medium text-sm shadow-xl transition-all flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0">
                    <MapPin className="w-4 h-4 text-primary" />
                    Abrir en Google Maps
                  </div>
                </a>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
                <MapPin className={`w-12 h-12 ${isHighContrast ? "text-yellow-300/40" : "text-secondary/40"}`} />
              </div>
            )}
          </div>

          <button
            onClick={() => setShowParticipantsModal(true)}
            className="flex items-center gap-4 w-full pt-2 hover:bg-muted/30 -mx-6 px-6 md:-mx-8 md:px-8 py-4 rounded-xl transition-colors"
          >
            <Users className="w-6 h-6 text-accent flex-shrink-0" />
            <div className="text-left">
              <p className="font-semibold">Participantes</p>
              <p className="text-sm text-muted-foreground">
                {event.participantsCount || 0} {event.maxParticipants ? `de ${event.maxParticipants}` : ""} personas apuntadas
              </p>
            </div>
          </button>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-3">Sobre este evento</h3>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.description}</p>
        </div>

        {/* Extensions Linking */}
        {event.extensions && event.extensions.length > 0 && (
          <div className="mb-8 bg-card rounded-2xl p-6 border border-border shadow-sm">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
               <Calendar className="w-5 h-5 text-accent" />
               Próximas ediciones
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
               Se han creado nuevas aportaciones basadas en este meetup original.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {event.extensions.map(ext => (
                <Link href={`/item/${ext._id}`} key={ext._id}>
                  <div className="bg-background border border-border rounded-xl p-3 flex gap-3 items-center hover:border-primary/50 transition-colors group shadow-sm">
                    {ext.coverImage ? (
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={ext.coverImage} className="w-full h-full object-cover" alt="" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-accent/50" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                       <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{ext.title}</p>
                       <p className="text-xs text-muted-foreground capitalize">{new Date(ext.dateTime).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        {!isFinished ? (
          <div className="space-y-3 mb-8 md:max-w-md md:mx-auto">
            <Button
              onClick={handleJoinOrFinish}
              variant={isAuthor ? "destructive" : userJoined ? "outline" : "default"}
              className="w-full h-14 text-base rounded-xl shadow-lg"
              size="lg"
            >
              {isAuthor ? "Finalizar evento" : userJoined ? "Desapuntarse" : "Unirse al evento"}
            </Button>
            {isAuthor && (
              <Button
                onClick={() => {
                  setDeleteError("");
                  setShowDeleteModal(true);
                }}
                variant="outline"
                className="w-full h-14 test-base rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10"
                size="lg"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar evento
              </Button>
            )}
          </div>
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

            {isAuthor && (
              <div className="mb-8 md:max-w-md md:mx-auto">
                <Button
                  onClick={() => {
                    setDeleteError("");
                    setShowDeleteModal(true);
                  }}
                  variant="outline"
                  className="w-full h-14 test-base rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10"
                  size="lg"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar evento
                </Button>
              </div>
            )}
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
                      <div className="relative aspect-video">
                        <Image
                          src={url}
                          alt={`Subido por ${item.user?.username}`}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover"
                        />
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

      {showDeleteModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => !deletingEvent && setShowDeleteModal(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-event-title"
            className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-3xl overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-border">
              <h3 id="delete-event-title" className="text-xl font-bold">Eliminar evento</h3>
              <p className="text-sm text-muted-foreground mt-2">
                ¿Está seguro de que desea eliminar este evento? Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="px-6 py-4">
              {deleteError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {deleteError}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingEvent}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteEvent}
                disabled={deletingEvent}
                className="rounded-xl"
              >
                {deletingEvent ? "Eliminando..." : "Sí, eliminar"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showParticipantsModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowParticipantsModal(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="px-6 py-5 border-b border-border flex justify-between items-center">
              <h3 className="text-xl font-bold">Participantes ({event.participants?.length || 0})</h3>
              <button
                onClick={() => setShowParticipantsModal(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-4">
              {event.participants && event.participants.length > 0 ? (
                event.participants.map((p) => (
                  <div key={p._id || p.clerkId} className="flex items-center gap-3 p-2 hover:bg-muted/40 rounded-xl transition-colors">
                    <Link href={`/user/${p.slug}`}>
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold cursor-pointer">
                        {p.name ? p.name.substring(0, 2).toUpperCase() : p.username?.substring(0, 2).toUpperCase()}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/user/${p.slug}`} className="font-semibold text-sm truncate block hover:text-primary transition-colors">
                        {p.name || p.username}
                      </Link>
                      <p className="text-xs text-muted-foreground truncate">@{p.username}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Aún no hay participantes en este evento.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
