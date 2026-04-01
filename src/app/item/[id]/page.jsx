"use client";

import { useState } from "react";
import { ArrowLeft, MapPin, Calendar, Users, Share2, Link as LinkIcon, UserPlus, UserCheck, Upload, Star, Trash2, Video } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import Masonry from "react-responsive-masonry";
import { getEventById } from "@/data/events";
import { PreviousEditions } from "@/components/PreviousEditions";
import { StarRating } from "@/components/StarRating";
import { useTheme } from "@/context/ThemeContext";
import { useAuth, useClerk } from "@clerk/nextjs";

export default function ItemDetailPage() {
  const { userId } = useAuth();
  const { openSignIn } = useClerk();
  const router = useRouter();
  const params = useParams();
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [rating, setRating] = useState(0);
  const [activeTab, setActiveTab] = useState("gallery");
  const { theme } = useTheme();
  const isHighContrast = theme === "high-contrast";

  const urlId = params?.id;
  const event = getEventById(urlId);

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Evento no encontrado</h2>
          <p className="text-muted-foreground mb-4">El evento que buscas no existe.</p>
          <Button onClick={() => router.push("/")}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const isFinished = event.status === "finished";
  const hasGallery = event.userGallery && event.userGallery.length > 0;
  const hasEditions = event.previousEditions && event.previousEditions.length > 0;
  const hasBothSections = hasGallery && hasEditions;

  const handleShare = () => {
    setShowSharePopup(true);
    setTimeout(() => setShowSharePopup(false), 2500);
  };

  const handleJoin = () => {
    if (!userId) {
      openSignIn();
      return;
    }
    alert("¡Te has apuntado al evento!");
  };

  const handleUploadMedia = () => {
    if (!userId) {
      openSignIn();
      return;
    }
    alert("Abriendo selector de archivos...");
  };

  const handleRatingSubmit = () => {
    if (!userId) {
      openSignIn();
      return;
    }
    if (rating > 0) {
      alert(`¡Gracias! Has valorado con ${rating} estrellas.`);
    }
  };

  const handleFollowToggle = () => {
    if (!userId) {
      openSignIn();
      return;
    }
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="relative h-72 md:h-96 w-full">
        <img src={event.image} alt="" className="w-full h-full object-cover" />

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
            <Badge className="bg-accent text-accent-foreground px-4 py-2 rounded-full">
              {event.category}
            </Badge>
            {event.isTrending && (
              <Badge className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full">
                Tendencia
              </Badge>
            )}
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
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: event.author.avatarColor }}
              >
                {event.author.initials}
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">Organizado por</p>
              <Link href={`/user/${event.author.slug}`} className="font-semibold text-sm truncate block hover:text-primary transition-colors">
                {event.author.name}
              </Link>
            </div>
            <button
              onClick={handleFollowToggle}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isFollowing
                  ? "bg-muted text-foreground"
                  : isHighContrast
                  ? "bg-primary text-black"
                  : "bg-primary text-white"
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  Siguiendo
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Seguir
                </>
              )}
            </button>
          </div>
        )}

        {/* Event Info Card */}
        <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-md space-y-6 mb-8">
          <div className="flex items-start gap-4">
            <Calendar className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-1">Fecha y hora</p>
              <p className="text-sm text-muted-foreground">
                {event.date} a las {event.time}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin className={`w-6 h-6 mt-0.5 flex-shrink-0 ${isHighContrast ? "text-yellow-300" : "text-secondary"}`} />
            <div className="flex-1">
              <p className="font-semibold mb-1">Ubicación</p>
              <p className="text-sm text-muted-foreground">{event.location}</p>
            </div>
          </div>

          {/* Mini Map Placeholder */}
          <div className="h-40 md:h-48 bg-muted rounded-xl overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
              <MapPin className={`w-12 h-12 ${isHighContrast ? "text-yellow-300/40" : "text-secondary/40"}`} />
            </div>
          </div>

          <button
            onClick={() => alert("Abriendo lista de participantes...")}
            className="flex items-center gap-4 w-full pt-2 hover:bg-muted/30 -mx-6 px-6 md:-mx-8 md:px-8 py-4 rounded-xl transition-colors"
          >
            <Users className="w-6 h-6 text-accent flex-shrink-0" />
            <div className="text-left">
              <p className="font-semibold">Participantes</p>
              <p className="text-sm text-muted-foreground">
                {event.participants.toLocaleString()} personas apuntadas
              </p>
            </div>
          </button>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-3">Sobre este evento</h3>
          <p className="text-muted-foreground leading-relaxed">{event.description}</p>
        </div>

        {/* CTA or Rating Section */}
        {!isFinished ? (
          <Button onClick={handleJoin} className="w-full md:max-w-md md:mx-auto md:block h-14 text-base rounded-xl shadow-lg mb-8" size="lg">
            Unirse al evento
          </Button>
        ) : (
          <>
            {/* Rating Section */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-md mb-8 max-w-md mx-auto">
              <h3 className="font-semibold text-lg mb-6">Valora este evento</h3>
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

            {/* Memories Section */}
            {event.memories && event.memories.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Recuerdos del evento</h3>
                  <span className="text-sm text-muted-foreground">
                    {event.memories.length} fotos
                  </span>
                </div>
                <Masonry columnsCount={2} gutter="16px">
                  {event.memories.map((photo, index) => (
                    <div
                      key={index}
                      className="relative rounded-2xl overflow-hidden group shadow-md"
                    >
                      <img src={photo} alt={`Recuerdo ${index + 1}`} className="w-full h-auto" />
                      {event.featuredMemory === index && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-yellow-500 text-white flex items-center gap-1.5 px-3 py-1.5">
                            <Star className="w-4 h-4 fill-white" />
                            Destacado
                          </Badge>
                        </div>
                      )}
                      <button className="absolute top-3 right-3 bg-destructive text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </Masonry>
              </div>
            )}
          </>
        )}

        {/* Combined Section with Tabs (when both exist) or Individual Sections */}
        {hasBothSections ? (
          <div className="mb-8">
            <div className="flex gap-3 mb-6 border-b border-border">
              <button
                onClick={() => setActiveTab("gallery")}
                className={`px-6 py-3 font-medium text-base rounded-t-lg transition-colors ${
                  activeTab === "gallery"
                    ? `bg-primary ${isHighContrast ? "text-black" : "text-white"}`
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                Galería de participantes
              </button>
              <button
                onClick={() => setActiveTab("editions")}
                className={`px-6 py-3 font-medium text-base rounded-t-lg transition-colors ${
                  activeTab === "editions"
                    ? `bg-primary ${isHighContrast ? "text-black" : "text-white"}`
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                Ediciones anteriores
              </button>
            </div>

            {activeTab === "gallery" ? (
              <GallerySection event={event} onUpload={handleUploadMedia} />
            ) : (
              <PreviousEditions editions={event.previousEditions} />
            )}
          </div>
        ) : (
          <>
            {hasGallery && (
              <GallerySection event={event} onUpload={handleUploadMedia} />
            )}
            {hasEditions && (
              <PreviousEditions editions={event.previousEditions} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function GallerySection({ event, onUpload }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">Compartido por participantes</h3>
        <span className="text-sm text-muted-foreground">
          {event.userGallery.length} elementos
        </span>
      </div>

      <div className="mb-6">
        <Button
          onClick={onUpload}
          variant="outline"
          className="w-full md:w-auto h-12 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <Upload className="w-5 h-5 mr-2" />
          Subir fotos y vídeos
        </Button>
      </div>

      <Masonry columnsCount={2} gutter="16px">
        {event.userGallery.map((item) => {
          const url = typeof item === "string" ? item : item.url;
          const key = typeof item === "string" ? item : item.id;

          return (
            <div key={key} className="relative rounded-2xl overflow-hidden group shadow-md bg-card border border-border">
              <div className="relative">
                <img src={url} alt={typeof item === "string" ? "Galería" : `Subido por ${item.username}`} className="w-full h-auto" />
                {typeof item !== "string" && item.type === "video" && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-3">
                      <Video className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                )}
              </div>
              {typeof item !== "string" && (
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{item.username}</p>
                      <p className="text-xs text-muted-foreground">{item.uploadedAt}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </Masonry>
    </div>
  );
}
