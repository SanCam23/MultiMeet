"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, MapPin, Calendar, Tag, Image as ImageIcon, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useTheme } from "@/context/ThemeContext";
import { Show, SignInButton } from "@clerk/nextjs";
import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full bg-muted rounded-2xl animate-pulse flex items-center justify-center text-sm text-muted-foreground border-2 border-dashed border-border">
      Cargando mapa...
    </div>
  ),
});

const categories = [
  "Tech", "Social", "Fitness", "Music", "Outdoor", "Food", 
  "Art", "Books", "Sports", "Gaming", "Professional"
];

export default function UploadPage() {
  const router = useRouter();
  const coverImageInputRef = useRef(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [formType, setFormType] = useState("new");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationData, setLocationData] = useState({
    address: "",
    lat: null,
    lng: null,
  });
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [coverImageName, setCoverImageName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const { theme } = useTheme();
  const isHighContrast = theme === "high-contrast";

  const [parentEventId, setParentEventId] = useState("");
  const [myEvents, setMyEvents] = useState([]);

  useEffect(() => {
    if (formType === "extend" && myEvents.length === 0) {
      fetch("/api/events/my")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setMyEvents(data);
        })
        .catch(console.error);
    }
  }, [formType, myEvents.length]);

  useEffect(() => {
    return () => {
      if (coverImagePreview) {
        URL.revokeObjectURL(coverImagePreview);
      }
    };
  }, [coverImagePreview]);

  const handleCoverImageClick = () => {
    coverImageInputRef.current?.click();
  };

  const handleCoverImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setSubmitError("Selecciona un archivo de imagen válido.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSubmitError("La imagen supera el límite de 5MB.");
      return;
    }

    try {
      setSubmitError("");
      if (coverImagePreview) {
        URL.revokeObjectURL(coverImagePreview);
      }

      const previewUrl = URL.createObjectURL(file);
      setCoverImageFile(file);
      setCoverImagePreview(previewUrl);
      setCoverImageName(file.name);
    } catch (error) {
      setSubmitError(error.message || "No se pudo cargar la imagen.");
    } finally {
      event.target.value = "";
    }
  };

  const handleRemoveCoverImage = () => {
    if (coverImagePreview) {
      URL.revokeObjectURL(coverImagePreview);
    }
    setCoverImageFile(null);
    setCoverImagePreview("");
    setCoverImageName("");
    if (coverImageInputRef.current) {
      coverImageInputRef.current.value = "";
    }
  };

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitError("");
    setSubmitSuccess("");

    const isExtend = formType === "extend";

    if (isExtend && !parentEventId) {
      setSubmitError("Selecciona un evento original para ampliar.");
      return;
    }

    if (!isExtend && selectedCategories.length === 0) {
      setSubmitError("Selecciona al menos una categoría.");
      return;
    }

    if (!isExtend && !locationData.address.trim()) {
      setSubmitError("Selecciona una ubicación.");
      return;
    }

    const dateTime = new Date(`${date}T${time}`);
    if (Number.isNaN(dateTime.getTime())) {
      setSubmitError("La fecha y hora no son válidas.");
      return;
    }

    if (dateTime.getTime() <= Date.now()) {
      setSubmitError("La fecha y hora del evento deben ser futuras.");
      return;
    }

    try {
      setIsSubmitting(true);

      let coverImageUrl = "";

      if (!isExtend && coverImageFile) {
        const imageFormData = new FormData();
        imageFormData.append("file", coverImageFile);

        const uploadResponse = await fetch("/api/uploads/dropbox", {
          method: "POST",
          body: imageFormData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadData?.error || "No se pudo subir la imagen a Dropbox");
        }

        coverImageUrl = uploadData.url;
      }

      const payload = {
        title,
        description,
        dateTime: dateTime.toISOString(),
      };

      if (!isExtend) {
        payload.locationText = locationData.address;
        payload.lat = locationData.lat;
        payload.lng = locationData.lng;
        payload.categories = selectedCategories;
        payload.coverImage = coverImageUrl;
        payload.maxParticipants = maxParticipants ? Number(maxParticipants) : undefined;
      } else {
        payload.parentEventId = parentEventId;
      }

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "No se pudo crear el evento");
      }

      setSubmitSuccess("Evento creado correctamente en la base de datos.");
      setTitle("");
      setDescription("");
      setLocationData({ address: "", lat: null, lng: null });
      setDate("");
      setTime("");
      setMaxParticipants("");
      handleRemoveCoverImage();
      setSelectedCategories([]);

      setTimeout(() => {
        router.push("/categories");
      }, 1200);
    } catch (error) {
      setSubmitError(error.message || "Ocurrió un error al crear el evento.");
    } finally {
      setIsSubmitting(false);
    }
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
              {(submitError || submitSuccess) && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    submitError
                      ? "border-destructive/30 bg-destructive/10 text-destructive"
                      : "border-green-600/30 bg-green-600/10 text-green-700"
                  }`}
                >
                  {submitError || submitSuccess}
                </div>
              )}

              {/* Cover Image */}
              <div>
                <Label className="mb-3 block">Imagen de portada</Label>
                <input
                  ref={coverImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverImageChange}
                />

                <div className="border-2 border-dashed border-border rounded-2xl min-h-48 flex flex-col items-center justify-center gap-3 bg-card hover:bg-muted/20 transition-colors px-4 py-6">
                  {coverImagePreview ? (
                    <div className="w-full max-w-md space-y-4">
                      <div className="relative overflow-hidden rounded-2xl border border-border shadow-sm">
                        <Image
                          src={coverImagePreview}
                          alt="Vista previa de la portada"
                          width={1200}
                          height={700}
                          unoptimized
                          className="w-full h-52 object-cover"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-sm text-muted-foreground truncate max-w-full">
                          {coverImageName || "Imagen seleccionada"}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                          onClick={handleRemoveCoverImage}
                        >
                          Quitar imagen
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-12 h-12 text-secondary" aria-hidden="true" />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        onClick={handleCoverImageClick}
                      >
                        Subir imagen
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        JPG, PNG o GIF (máx. 5MB)
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title" className="mb-3 block">Título del evento</Label>
                <Input
                  id="title"
                  placeholder="Dale un título atractivo a tu meetup"
                  className="h-12 rounded-xl"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                <LocationPicker
                  value={locationData.address}
                  lat={locationData.lat}
                  lng={locationData.lng}
                  onChange={({ address, lat, lng }) => {
                    setLocationData({ address, lat, lng });
                  }}
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="mb-3 block">
                    <Calendar className="w-4 h-4 inline mr-1.5 text-primary" aria-hidden="true" />
                    Fecha
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    className="h-12 rounded-xl"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="mb-3 block">Hora</Label>
                  <Input
                    id="time"
                    type="time"
                    className="h-12 rounded-xl"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
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
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(e.target.value)}
                  min="1"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-base rounded-xl shadow-lg"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Publicando..." : "Publicar Meetup"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {(submitError || submitSuccess) && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    submitError
                      ? "border-destructive/30 bg-destructive/10 text-destructive"
                      : "border-green-600/30 bg-green-600/10 text-green-700"
                  }`}
                >
                  {submitError || submitSuccess}
                </div>
              )}

              {/* Parent Event Selection */}
              <div>
                <Label htmlFor="parentEvent" className="mb-3 block">Ampliar desde evento</Label>
                <select
                  id="parentEvent"
                  className="w-full h-12 px-4 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground"
                  value={parentEventId}
                  onChange={(e) => setParentEventId(e.target.value)}
                  required
                >
                  <option value="">Selecciona un evento...</option>
                  {myEvents.map((ev) => (
                    <option key={ev._id} value={ev._id}>
                      {ev.title} ({new Date(ev.dateTime).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Extension Details */}
              <div>
                <Label htmlFor="extensionTitle" className="mb-3 block">Tu aportación</Label>
                <Input
                  id="extensionTitle"
                  placeholder="¿Qué añades a este evento?"
                  className="h-12 rounded-xl"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="extensionDetails" className="mb-3 block">Detalles</Label>
                <Textarea
                  id="extensionDetails"
                  placeholder="Describe tu contribución..."
                  className="min-h-32 rounded-xl"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Date & Time for Extension */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="extDate" className="mb-3 block">Fecha</Label>
                  <Input id="extDate" type="date" className="h-12 rounded-xl" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="extTime" className="mb-3 block">Hora</Label>
                  <Input id="extTime" type="time" className="h-12 rounded-xl" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-base rounded-xl shadow-lg" size="lg">
                {isSubmitting ? "Publicando..." : "Publicar ampliación"}
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
