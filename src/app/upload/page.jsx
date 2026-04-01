"use client";

import { useState } from "react";
import { ArrowLeft, MapPin, Calendar, Tag, Image as ImageIcon, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useTheme } from "@/context/ThemeContext";
import { Show, SignInButton } from "@clerk/nextjs";

const categories = [
  "Tech", "Social", "Fitness", "Music", "Outdoor", "Food", 
  "Art", "Books", "Sports", "Gaming", "Professional"
];

export default function UploadPage() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [formType, setFormType] = useState("new");
  const { theme } = useTheme();
  const isHighContrast = theme === "high-contrast";

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("¡Meetup creado con éxito!");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="px-6 py-5 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-muted/50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Volver atrás">
            <ArrowLeft className="w-6 h-6" aria-hidden="true" />
          </button>
          <h1 className="text-xl font-semibold">Crear Meetup</h1>
        </div>
      </div>

      <Show when="signed-in">
        {/* Form Container */}
        <div className="w-full mx-auto px-6 md:px-8 lg:px-12 pt-8 max-w-[900px]">
          {/* Form Type Toggle */}
          <div className="max-w-md mx-auto mb-8" role="tablist">
            <div className="grid w-full grid-cols-2 h-12 bg-card rounded-xl p-1">
              <button
                role="tab"
                aria-selected={formType === "new"}
                onClick={() => setFormType("new")}
                className={`rounded-lg transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                  formType === "new"
                    ? `bg-primary ${isHighContrast ? "text-black" : "text-white"} shadow-sm`
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Nuevo Meetup
              </button>
              <button
                role="tab"
                aria-selected={formType === "extend"}
                onClick={() => setFormType("extend")}
                className={`rounded-lg transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                  formType === "extend"
                    ? `bg-primary ${isHighContrast ? "text-black" : "text-white"} shadow-sm`
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Ampliar Evento
              </button>
            </div>
          </div>

          {formType === "new" ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Cover Image */}
              <div>
                <Label className="mb-3 block">Imagen de portada</Label>
                <div className="border-2 border-dashed border-border rounded-2xl h-48 flex flex-col items-center justify-center gap-3 bg-card hover:bg-muted/20 transition-colors cursor-pointer">
                  <ImageIcon className="w-12 h-12 text-secondary" aria-hidden="true" />
                  <Button type="button" variant="outline" size="sm" className="rounded-xl">
                    Subir imagen
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG o GIF (máx. 5MB)
                  </p>
                </div>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title" className="mb-3 block">Título del evento</Label>
                <Input
                  id="title"
                  placeholder="Dale un título atractivo a tu meetup"
                  className="h-12 rounded-xl"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="mb-3 block">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Cuéntale a la gente de qué trata tu meetup..."
                  className="min-h-32 rounded-xl"
                  required
                />
              </div>

              {/* Categories */}
              <div>
                <Label className="mb-3 block">
                  <Tag className="w-4 h-4 inline mr-1.5 text-accent" aria-hidden="true" />
                  Categorías
                </Label>
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`inline-flex px-4 py-2 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring transition-colors border ${
                        selectedCategories.includes(category)
                          ? "bg-accent text-accent-foreground border-accent hover:bg-accent/90"
                          : "bg-transparent text-foreground border-input hover:border-accent"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location" className="mb-3 block">
                  <MapPin className="w-4 h-4 inline mr-1.5 text-secondary" aria-hidden="true" />
                  Ubicación
                </Label>
                <Input
                  id="location"
                  placeholder="Busca una ubicación..."
                  className="h-12 rounded-xl"
                  required
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="mb-3 block">
                    <Calendar className="w-4 h-4 inline mr-1.5 text-primary" aria-hidden="true" />
                    Fecha
                  </Label>
                  <Input id="date" type="date" className="h-12 rounded-xl" required />
                </div>
                <div>
                  <Label htmlFor="time" className="mb-3 block">Hora</Label>
                  <Input id="time" type="time" className="h-12 rounded-xl" required />
                </div>
              </div>

              {/* Max Participants */}
              <div>
                <Label htmlFor="maxParticipants" className="mb-3 block">
                  Máximo de participantes (opcional)
                </Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  placeholder="Sin límite"
                  className="h-12 rounded-xl"
                />
              </div>

              <Button type="submit" className="w-full h-14 text-base rounded-xl shadow-lg" size="lg">
                Publicar Meetup
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Parent Event Selection */}
              <div>
                <Label htmlFor="parentEvent" className="mb-3 block">Ampliar desde evento</Label>
                <select
                  id="parentEvent"
                  className="w-full h-12 px-4 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground"
                  required
                >
                  <option value="">Selecciona un evento...</option>
                  <option value="1">Tech Networking Night</option>
                  <option value="2">Coffee & Conversation</option>
                  <option value="3">Sunrise Yoga Session</option>
                </select>
              </div>

              {/* Extension Details */}
              <div>
                <Label htmlFor="extensionTitle" className="mb-3 block">Tu aportación</Label>
                <Input
                  id="extensionTitle"
                  placeholder="¿Qué añades a este evento?"
                  className="h-12 rounded-xl"
                  required
                />
              </div>

              <div>
                <Label htmlFor="extensionDetails" className="mb-3 block">Detalles</Label>
                <Textarea
                  id="extensionDetails"
                  placeholder="Describe tu contribución..."
                  className="min-h-32 rounded-xl"
                  required
                />
              </div>

              {/* Date & Time for Extension */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="extDate" className="mb-3 block">Fecha</Label>
                  <Input id="extDate" type="date" className="h-12 rounded-xl" required />
                </div>
                <div>
                  <Label htmlFor="extTime" className="mb-3 block">Hora</Label>
                  <Input id="extTime" type="time" className="h-12 rounded-xl" required />
                </div>
              </div>

              <Button type="submit" className="w-full h-14 text-base rounded-xl shadow-lg" size="lg">
                Publicar ampliación
              </Button>
            </form>
          )}
        </div>
      </Show>

      <Show when="signed-out">
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <PlusCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">¡Únete a la comunidad!</h2>
          <p className="text-muted-foreground mb-8 max-w-sm">
            Inicia sesión para poder crear y compartir tus propios meetups con gente de tu ciudad.
          </p>
          <SignInButton mode="modal">
            <Button size="lg" className="rounded-xl px-8 h-14 text-base shadow-lg">
              Iniciar Sesión ahora
            </Button>
          </SignInButton>
        </div>
      </Show>
    </div>
  );
}
