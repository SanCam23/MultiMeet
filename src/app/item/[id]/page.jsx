"use client";

import { useState } from "react";
import { ArrowLeft, MapPin, Calendar, Users, Share2, Link as LinkIcon, UserPlus } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import Masonry from "react-responsive-masonry";
import { getEventById, mockEvents } from "@/data/events";
import { PreviousEditions } from "@/components/PreviousEditions";

export default function ItemDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  // Intentamos obtener el evento exacto, si no, por defecto usamos un mock genérico temporal
  const urlId = params?.id;
  const foundEvent = getEventById(urlId);
  
  const event = foundEvent || mockEvents.following[0];

  const handleShare = () => {
    setShowSharePopup(true);
    setTimeout(() => setShowSharePopup(false), 2500);
  };

  return (
    <article className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <header className="relative h-72 md:h-96 w-full">
        <img src={event.image} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none" />
        
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 bg-card/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-card focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          aria-label="Volver atrás"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" aria-hidden="true" />
        </button>

        <button
          onClick={handleShare}
          className="absolute top-6 right-6 bg-card/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-card focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          aria-label="Compartir evento"
        >
          <Share2 className="w-6 h-6 text-foreground" aria-hidden="true" />
        </button>

        {showSharePopup && (
          <div className="absolute top-20 right-6 flex items-center gap-2.5 bg-card border border-border rounded-2xl px-4 py-3 shadow-xl transition-all" role="alert">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10`}>
              <LinkIcon className={`w-4 h-4 text-primary`} aria-hidden="true" />
            </div>
            <span className="text-sm font-medium text-foreground">
              Enlace copiado correctamente
            </span>
          </div>
        )}
      </header>

      {/* Detail Content */}
      <div className="w-full mx-auto px-6 md:px-8 lg:px-12 py-8 max-w-[1000px] -mt-10 relative z-10">
        <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl border border-border">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-2 mb-6" aria-label="Categorías del evento">
              <Badge className="bg-accent text-accent-foreground px-4 py-2 rounded-full">
                {event.category}
              </Badge>
              <Badge className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 px-4 py-2 rounded-full">
                {event.isTrending ? "Tendencia" : "Nuevo"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-background rounded-2xl px-5 py-4 mb-8 shadow-sm">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold"
              style={{ backgroundColor: event.author.avatarColor }}
              aria-hidden="true"
            >
              {event.author.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">Organizado por</p>
              <p className="font-semibold text-sm truncate">{event.author.name}</p>
            </div>
          </div>

          <section className="space-y-4 mb-8 text-sm" aria-label="Información del evento">
            <div className="flex items-start gap-4 p-3 bg-secondary/10 rounded-xl">
              <Calendar className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-medium text-base mb-1">{event.date}</p>
                <p className="text-muted-foreground">{event.time}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 bg-secondary/10 rounded-xl">
              <MapPin className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-medium text-base mb-1">Ubicación</p>
                <p className="text-muted-foreground">{event.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 bg-secondary/10 rounded-xl">
              <Users className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-medium text-base mb-1">Asistentes</p>
                <p className="text-muted-foreground">{event.participants} personas apuntadas</p>
              </div>
            </div>
          </section>

          <section aria-labelledby="desc-heading" className="mb-8">
            <h2 id="desc-heading" className="font-semibold text-xl mb-4">Sobre el evento</h2>
            <p className="text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </section>

          <section aria-labelledby="gallery-heading" className="mb-8">
            <h2 id="gallery-heading" className="font-semibold text-xl mb-4">Galería colaborativa</h2>
            <Masonry columnsCount={2} gutter="12px">
               {event.userGallery.map((url, i) => (
                 <img key={i} src={url} alt={`Imagen ${i+1} del evento`} className="w-full rounded-xl" loading="lazy" />
               ))}
            </Masonry>
          </section>

          <div className="flex gap-4 pt-4 border-t border-border mt-auto">
            <Button 
               size="lg" 
               className={`flex-1 h-16 rounded-2xl text-lg font-semibold shadow-xl transition-all ${isJoined ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' : ''}`}
               onClick={() => setIsJoined(!isJoined)}
            >
              {isJoined ? "Apuntado" : "Unirme al evento"}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
