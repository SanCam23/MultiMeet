"use client";

import { useState } from "react";
import { ArrowLeft, MapPin, Calendar, Tag, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";

const categories = [
  "Tech", "Social", "Fitness", "Music", "Outdoor", "Food", 
  "Art", "Books", "Sports", "Gaming", "Professional"
];

export default function UploadPage() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [formType, setFormType] = useState("new");

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("¡Elemento creado con éxito!");
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
          <h1 className="text-xl font-semibold">Subir Contenido / Evento</h1>
        </div>
      </div>

      <div className="w-full mx-auto px-6 md:px-8 lg:px-12 pt-8 max-w-[900px]">
        {/* Form Type Tablist */}
        <div className="max-w-md mx-auto mb-8" role="tablist">
          <div className="grid w-full grid-cols-2 h-12 bg-card rounded-xl p-1">
            <button
              role="tab"
              aria-selected={formType === "new"}
              onClick={() => setFormType("new")}
              className={`rounded-lg transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                formType === "new" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Nuevo Multimedia
            </button>
            <button
              role="tab"
              aria-selected={formType === "extend"}
              onClick={() => setFormType("extend")}
              className={`rounded-lg transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                formType === "extend" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Ampliar Evento
            </button>
          </div>
        </div>

        {formType === "new" ? (
          <form onSubmit={handleSubmit} className="space-y-8" aria-label="Formulario para nuevo contenido multimedia">
            {/* Cover Image/Media */}
            <div>
              <Label className="mb-3 block">Subir contenido (Imagen, Video, Audio, 3D...)</Label>
              <div 
                className="border-2 border-dashed border-border rounded-2xl h-48 flex flex-col items-center justify-center gap-3 bg-card hover:bg-muted/20 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-ring"
                tabIndex={0}
                role="button"
                aria-label="Haz clic para seleccionar archivos"
              >
                <ImageIcon className="w-12 h-12 text-secondary" aria-hidden="true" />
                <Button type="button" variant="outline" size="sm" className="rounded-xl pointer-events-none">
                  Seleccionar archivo
                </Button>
                <p className="text-xs text-muted-foreground text-center px-4">
                  Soporta formatos multimedia compatibles con web (máx. 50MB)
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="title" className="mb-3 block">Título</Label>
              <Input
                id="title"
                placeholder="Escribe un título descriptivo"
                className="h-12 rounded-xl"
                required
                aria-required="true"
              />
            </div>

            <div>
              <Label htmlFor="description" className="mb-3 block">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Cuenta más detalles sobre tu subida..."
                className="min-h-[8rem] rounded-xl"
                required
                aria-required="true"
              />
            </div>

            <div>
              <Label className="mb-3 block">
                <Tag className="w-4 h-4 inline mr-1.5 text-accent" aria-hidden="true" />
                Categorías / Etiquetas
              </Label>
              <div className="flex flex-wrap gap-3" role="group" aria-label="Selecciona etiquetas">
                {categories.map((category) => {
                  const isSelected = selectedCategories.includes(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => toggleCategory(category)}
                      className={`inline-flex px-4 py-2 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring transition-colors border ${
                        isSelected
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-transparent text-foreground border-input hover:border-accent"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="location" className="mb-3 block">
                <MapPin className="w-4 h-4 inline mr-1.5 text-secondary" aria-hidden="true" />
                Ubicación (opcional)
              </Label>
              <Input
                id="location"
                placeholder="Si aplica a un lugar físico"
                className="h-12 rounded-xl"
              />
            </div>

            <Button type="submit" className="w-full h-14 text-base rounded-xl shadow-lg" size="lg">
              Publicar Contenido
            </Button>
          </form>
        ) : (
           <form onSubmit={handleSubmit} className="space-y-8" aria-label="Formulario para apuntarse/ampliar en un evento">
              <div>
                <Label htmlFor="parentEvent" className="mb-3 block">Seleccionar evento a ampliar</Label>
                <select
                  id="parentEvent"
                  className="w-full h-12 px-4 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground"
                  required
                  aria-required="true"
                >
                  <option value="">Selecciona un evento...</option>
                  <option value="1">Tech Networking Night</option>
                  <option value="2">Coffee & Conversation</option>
                  <option value="3">Sunrise Yoga Session</option>
                </select>
              </div>

              <div>
                <Label htmlFor="extensionTitle" className="mb-3 block">Tu aportación / Contenido</Label>
                <Input
                  id="extensionTitle"
                  placeholder="¿Qué añades a este evento?"
                  className="h-12 rounded-xl"
                  required
                  aria-required="true"
                />
              </div>

              <div>
                <Label htmlFor="extensionDetails" className="mb-3 block">Detalles de archivo o participación</Label>
                <Textarea
                  id="extensionDetails"
                  placeholder="Describe o propociona un enlace a tu repositorio / diseño..."
                  className="min-h-[8rem] rounded-xl"
                  required
                  aria-required="true"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="extDate" className="mb-3 block">Fecha planificada</Label>
                  <Input
                    id="extDate"
                    type="date"
                    className="h-12 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="extTime" className="mb-3 block">Hora</Label>
                  <Input
                    id="extTime"
                    type="time"
                    className="h-12 rounded-xl"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-14 text-base rounded-xl shadow-lg" size="lg">
                Vincular aportación
              </Button>
            </form>
        )}
      </div>
    </div>
  );
}
