"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, MapPin, Calendar, Users, Share2, Link as LinkIcon, UserPlus, UserCheck, Upload, Star, Trash2, Video, X, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
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
  const { userId, isLoaded } = useAuth();
  const { openSignIn } = useClerk();
  const router = useRouter();
  const params = useParams();
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [rating, setRating] = useState(0);
  const [activeTab, setActiveTab] = useState("gallery");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  // Custom Modals State
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [showRateSuccess, setShowRateSuccess] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showDeleteMediaModal, setShowDeleteMediaModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeletingMedia, setIsDeletingMedia] = useState(false);

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
    if (isLoaded && !userId) {
      router.replace("/");
      setTimeout(() => openSignIn(), 100);
    }
  }, [isLoaded, userId, router, openSignIn]);

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

  if (!isLoaded || (isLoaded && !userId)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Redirigiendo...</p>
      </div>
    );
  }

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
    if (!userId) {
      openSignIn();
      return;
    }
    const eventUrl = `${window.location.origin}/item/${urlId}`;
    navigator.clipboard.writeText(eventUrl).then(() => {
      setShowSharePopup(true);
      setShowShareModal(true);
      setTimeout(() => setShowSharePopup(false), 2500);
    });
  };

  const copyLinkFromModal = () => {
    const eventUrl = `${window.location.origin}/item/${urlId}`;
    navigator.clipboard.writeText(eventUrl).then(() => {
      setShareLinkCopied(true);
      setTimeout(() => setShareLinkCopied(false), 2000);
    });
  };

  const handleJoinOrFinish = async () => {
    if (!userId) {
      openSignIn();
      return;
    }

    if (isAuthor && !isFinished) {
      setShowFinishModal(true);
      return;
    }

    if (isFinished) return;

    if (userJoined) {
      setShowLeaveModal(true);
    } else {
      setShowJoinModal(true);
    }
  };

  const confirmFinish = async () => {
    try {
      const res = await fetch(`/api/events/${urlId}/finish`, {
        method: "POST"
      });
      if (res.ok) {
        setEvent({ ...event, status: "finished" });
        setShowFinishModal(false);
      }
    } catch (e) {
      console.error(e);
      setShowFinishModal(false);
    }
  };

  const confirmJoin = async () => {
    try {
      const res = await fetch(`/api/events/${urlId}/join`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        setUserJoined(data.joined);
        setEvent({ ...event, participantsCount: data.participantsCount });
        setShowJoinModal(false);
        setShowLeaveModal(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const confirmLeave = async () => {
    try {
      const res = await fetch(`/api/events/${urlId}/join`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        setUserJoined(data.joined);
        setEvent({ ...event, participantsCount: data.participantsCount });
        setShowLeaveModal(false);
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

  const handleDeleteMedia = (itemId) => {
    setItemToDelete(itemId);
    setShowDeleteMediaModal(true);
  };

  const confirmDeleteMedia = async () => {
    if (!itemToDelete) return;

    try {
      setIsDeletingMedia(true);
      const res = await fetch(`/api/events/${urlId}/gallery?itemId=${itemToDelete}`, {
        method: "DELETE"
      });

      if (res.ok) {
        const data = await res.json();
        setEvent({ ...event, userGallery: data.userGallery });
        setShowDeleteMediaModal(false);
        setItemToDelete(null);
      } else {
        const data = await res.json();
        alert(data.error || "Error al eliminar la imagen");
      }
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la imagen");
    } finally {
      setIsDeletingMedia(false);
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

    // Solo permitir rating si el usuario participó y el evento ha finalizado (o según tu lógica)
    if (!userJoined) {
      return;
    }

    if (rating > 0) {
      setShowRateModal(true);
    }
  };

  const confirmRating = async () => {
    try {
      const res = await fetch(`/api/events/${urlId}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating })
      });
      if (res.ok) {
        setShowRateModal(false);
        setShowRateSuccess(true);
        setTimeout(() => setShowRateSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
      alert("Error al valorar el evento.");
      setShowRateModal(false);
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

  const handleBack = () => {
    // Si viene de un enlace directo (QR) el historial es corto, redirigir al inicio
    if (window.history.length > 2 || document.referrer.includes(window.location.host)) {
      router.back();
    } else {
      router.push("/");
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
        {event.coverImage && (event.coverImage.split('?')[0].toLowerCase().endsWith('.mp4') || event.coverImage.split('?')[0].toLowerCase().endsWith('.webm')) ? (
          <video
            src={event.coverImage}
            fill
            className="absolute inset-0 w-full h-full object-cover bg-muted"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <Image
            src={event.coverImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1080"}
            alt={event.title || "Evento"}
            fill
            sizes="100vw"
            className="object-cover bg-muted"
            priority
            unoptimized={event.coverImage?.includes("dropbox") || event.coverImage?.includes("unsplash")}
          />
        )}

        <button
          onClick={handleBack}
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
            <Link href={`/user/${event.author.slug || event.author.username?.replace("@", "") || event.author._id}`}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold cursor-pointer hover:opacity-80 transition-opacity bg-primary"
              >
                {event.author.name?.substring(0, 2).toUpperCase()}
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">Organizado por</p>
              <Link href={`/user/${event.author.slug || event.author.username?.replace("@", "") || event.author._id}`} className="font-semibold text-sm truncate block hover:text-primary transition-colors">
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
            {userJoined && (
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
            )}

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

            {isFinished && (userJoined || isAuthor) && (
              <div className="mb-6">
                <input
                  type="file"
                  accept="image/*,video/*"
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
                  Añadir fotos y vídeos
                </Button>
              </div>
            )}

            {hasGallery && (
              <ResponsiveMasonry columnsCountBreakPoints={{ 300: 2, 768: 2, 1024: 3 }}>
                <Masonry gutter="16px">
                  {event.userGallery.map((item, index) => {
                    const url = item.url;
                    const isMyImage = item.user?.clerkId === userId;
                    const canDelete = isMyImage || isAuthor;

                    return (
                      <div key={index} className="relative rounded-2xl overflow-hidden group shadow-md bg-card border border-border">
                        <div
                          className="relative cursor-pointer"
                          onClick={() => setSelectedMediaIndex(index)}
                        >
                          {item.type === "video" ? (
                            <video
                              src={`${url}#t=0.1`}
                              className="w-full h-auto block hover:opacity-90 transition-opacity"
                              preload="metadata"
                              muted
                              playsInline
                            />
                          ) : (
                            <Image
                              src={url}
                              alt={`Subido por ${item.user?.username || item.user?.name || "usuario"}`}
                              width={600}
                              height={600}
                              className="w-full h-auto block hover:opacity-90 transition-opacity"
                              unoptimized={url.includes("dropbox") || url.includes("unsplash")}
                            />
                          )}
                          {item.type === "video" && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                              <div className="bg-white/90 rounded-full p-3 shadow-md">
                                <Video className="w-6 h-6 text-primary" />
                              </div>
                            </div>
                          )}
                          {canDelete && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMedia(item._id);
                              }}
                              className="absolute top-3 right-3 bg-primary/90 text-primary-foreground p-2 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-primary shadow-lg z-10"
                              title="Eliminar multimedia"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{item.user?.name || item.user?.username || "Usuario"}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(item.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                            {item.type !== "video" && (
                              <ImageIcon className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Masonry>
              </ResponsiveMasonry>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 text-destructive">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">¿Eliminar evento?</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Esta acción no se puede deshacer. Se eliminará el evento, las fotos de la galería y se notificará a los participantes.
              </p>
            </div>

            {deleteError && (
              <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium text-center">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-12"
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingEvent}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="flex-1 rounded-xl h-12"
                onClick={handleDeleteEvent}
                disabled={deletingEvent}
              >
                {deletingEvent ? "Eliminando..." : "Eliminar"}
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
                    <Link href={`/user/${p.slug || p.username?.replace("@", "") || p._id}`}>
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold cursor-pointer">
                        {p.name ? p.name.substring(0, 2).toUpperCase() : p.username?.substring(0, 2).toUpperCase()}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/user/${p.slug || p.username?.replace("@", "") || p._id}`} className="font-semibold text-sm truncate block hover:text-primary transition-colors">
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
      {/* Modals para unirse/desapuntarse */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowFinishModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 text-destructive">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">¿Finalizar evento?</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                ¿Seguro que deseas dar por finalizado este evento? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-12"
                onClick={() => setShowFinishModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="flex-1 rounded-xl h-12"
                onClick={confirmFinish}
              >
                Finalizar
              </Button>
            </div>
          </div>
        </div>
      )}

      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowJoinModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
                <UserPlus className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">¿Apuntarse al evento?</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                ¿Estás seguro de que deseas apuntarte a "{event.title}"? Confirma para unirte.
              </p>
            </div>
            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-12"
                onClick={() => setShowJoinModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                className="flex-1 rounded-xl h-12"
                onClick={confirmJoin}
              >
                Apuntarme
              </Button>
            </div>
          </div>
        </div>
      )}

      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowLeaveModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 text-destructive">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">¿Desapuntarse del evento?</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                ¿Estás seguro de que deseas desapuntarte de "{event.title}"? Podrás volver a apuntarte si aún hay plazas.
              </p>
            </div>
            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-12"
                onClick={() => setShowLeaveModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="flex-1 rounded-xl h-12"
                onClick={confirmLeave}
              >
                Desapuntarme
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para valorar */}
      {showRateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowRateModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">¿Valorar evento?</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Vas a valorar este evento con {rating} {rating === 1 ? 'estrella' : 'estrellas'}. ¿Confirmar?
              </p>
            </div>
            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-12"
                onClick={() => setShowRateModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                className="flex-1 rounded-xl h-12"
                onClick={confirmRating}
              >
                Valorar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast de confirmación de valoración */}
      {showRateSuccess && (
        <div className="fixed bottom-24 right-6 left-6 md:left-auto flex items-center gap-3 bg-[#4ade80] text-black border-none rounded-2xl px-6 py-4 shadow-xl z-50 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold">Evento valorado correctamente. ¡Gracias!</span>
        </div>
      )}
      {/* Modal para borrar imagen de la galería */}
      {showDeleteMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowDeleteMediaModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 text-destructive">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">¿Eliminar multimedia?</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                ¿Estás seguro de que deseas eliminar este elemento de la galería? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-12"
                onClick={() => setShowDeleteMediaModal(false)}
                disabled={isDeletingMedia}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="flex-1 rounded-xl h-12"
                onClick={confirmDeleteMedia}
                disabled={isDeletingMedia}
              >
                {isDeletingMedia ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedMediaIndex !== null && event.userGallery && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/90 backdrop-blur-xl p-4 animate-in fade-in duration-200">
          {/* Close Button */}
          <button
            onClick={() => setSelectedMediaIndex(null)}
            className="absolute top-6 right-6 bg-card/90 backdrop-blur-sm border border-border text-foreground hover:bg-accent hover:text-accent-foreground p-3 rounded-full shadow-lg transition-colors z-20"
            aria-label="Cerrar galería"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          {event.userGallery.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMediaIndex((prev) => (prev === 0 ? event.userGallery.length - 1 : prev - 1));
                }}
                className="absolute left-4 md:left-8 bg-card/90 backdrop-blur-sm border border-border text-foreground hover:bg-accent hover:text-accent-foreground p-3 rounded-full shadow-lg transition-colors z-20"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMediaIndex((prev) => (prev === event.userGallery.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-4 md:right-8 bg-card/90 backdrop-blur-sm border border-border text-foreground hover:bg-accent hover:text-accent-foreground p-3 rounded-full shadow-lg transition-colors z-20"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Media Container */}
          <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center pointer-events-none p-4 md:p-12">
            <div className="relative pointer-events-auto w-full h-full flex items-center justify-center">
              {event.userGallery[selectedMediaIndex].type === "video" ? (
                <video
                  src={event.userGallery[selectedMediaIndex].url}
                  controls
                  autoPlay
                  className="max-h-[75vh] max-w-full rounded-2xl shadow-2xl border border-border bg-black/5"
                />
              ) : (
                <Image
                  src={event.userGallery[selectedMediaIndex].url}
                  alt="Gallery preview"
                  width={1200}
                  height={1200}
                  style={{ width: 'auto', height: 'auto' }}
                  className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-border bg-black/5"
                  priority
                  unoptimized={event.userGallery[selectedMediaIndex].url.includes("dropbox") || event.userGallery[selectedMediaIndex].url.includes("unsplash")}
                />
              )}
            </div>

            {/* User Info Pill */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
              <div className="bg-card/95 backdrop-blur-md border border-border px-6 py-3 rounded-full shadow-xl flex items-center gap-3">
                {event.userGallery[selectedMediaIndex].user?.imageUrl ? (
                  <img
                    src={event.userGallery[selectedMediaIndex].user.imageUrl}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                    {(event.userGallery[selectedMediaIndex].user?.name || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col text-left">
                  <p className="text-foreground font-semibold text-sm leading-tight">
                    {event.userGallery[selectedMediaIndex].user?.name || event.userGallery[selectedMediaIndex].user?.username || "Usuario"}
                  </p>
                  <p className="text-muted-foreground text-xs leading-tight mt-0.5">
                    {new Date(event.userGallery[selectedMediaIndex].uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal interactivo de compartir (QR + Link) */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4">Compartir evento</h3>
              <div className="bg-white p-4 rounded-xl inline-block mb-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/item/${urlId}` : '')}`}
                  alt="QR Code de evento"
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <p className="text-sm text-muted-foreground mb-4">Escanea el código QR o copia el enlace a continuación</p>
              <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl border z-10 relative">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== 'undefined' ? `${window.location.origin}/item/${urlId}` : ''}
                  className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm px-2 text-foreground truncate"
                />
                <Button
                  size="sm"
                  onClick={copyLinkFromModal}
                  variant={shareLinkCopied ? "default" : "secondary"}
                  className="rounded-lg h-8 flex-shrink-0"
                >
                  {shareLinkCopied ? <span className="flex items-center gap-1"><UserCheck className="w-4 h-4" /> ¡Copiado!</span> : "Copiar"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
