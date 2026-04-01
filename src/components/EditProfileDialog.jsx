"use client";

import { useEffect, useState, useRef } from "react";
import { X, Save, Camera, Loader2, MapPin } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
  ssr: false,
  loading: () => <div className="h-48 w-full bg-muted rounded-2xl animate-pulse flex items-center justify-center text-sm text-muted-foreground border-2 border-dashed border-border"><MapPin className="w-4 h-4 mr-2 animate-bounce" /> Cargando mapa...</div>
});

export function EditProfileDialog({ open, onOpenChange, userData, onSaveSuccess }) {
  const { theme } = useTheme();
  const { user } = useUser();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    avatar: "",
    location: "",
    lat: null,
    lng: null,
  });
  
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      if (userData) {
        setFormData({
          name: userData.name || "",
          username: userData.username || "",
          bio: userData.bio || "",
          avatar: userData.avatar || "",
          location: userData.location || "",
          lat: userData.lat || null,
          lng: userData.lng || null,
        });
        setPreviewUrl(userData.avatar || "");
      }
    } else {
      document.body.style.overflow = "unset";
      setError("");
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open, userData]);

  if (!open) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vista previa instantánea (Local)
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      setUploading(true);
      setError("");
      
      // Subimos la imagen directamente a Clerk
      const response = await user.setProfileImage({ file });
      
      // Intentamos obtener la nueva URL. Clerk a veces la devuelve en el objeto, o lo actualiza en el hook
      const newUrl = response?.imageUrl || user.imageUrl;
      
      // Actualizamos nuestro formData con la URL REAL de Clerk
      setFormData(prev => ({ ...prev, avatar: newUrl }));

    } catch (err) {
      console.error("Error subiendo imagen:", err);
      setError("No se pudo subir la imagen. Inténtalo de nuevo.");
      setPreviewUrl(formData.avatar);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar perfil");
      }

      // Aseguramos que la UI reciba los datos finales (incluyendo el avatar procesado por el backend)
      onSaveSuccess(data);
      onOpenChange(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="relative w-full sm:max-w-[525px] bg-card border border-border shadow-2xl rounded-3xl p-0 gap-0 max-h-[90vh] flex flex-col overflow-hidden m-4 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="px-6 pt-6 pb-4 border-b border-border shrink-0 flex items-center justify-between">
          <h2 id="edit-profile-title" className="text-2xl font-bold">Editar Perfil</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 overscroll-contain px-6 py-5">
          <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100/20 border border-red-500/50 text-red-500 rounded-xl text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full border-4 border-secondary/20 overflow-hidden bg-primary/5 flex items-center justify-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Vista previa" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-1 right-1 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
                  aria-label="Cambiar foto de perfil"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <p className="text-xs text-muted-foreground">Haz clic en la cámara para subir una foto desde tu PC</p>
            </div>
            
            <div>
              <Label htmlFor="name" className="mb-2 block">Nombre completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre completo"
                className="h-12 rounded-xl"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="username" className="mb-2 block">Nombre de usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="@tu_usuario"
                className="h-12 rounded-xl"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="location" className="mb-2 block">Ubicación</Label>
              <LocationPicker 
                value={formData.location}
                lat={formData.lat}
                lng={formData.lng}
                onChange={({ address, lat, lng }) => {
                  setFormData(prev => ({ ...prev, location: address, lat, lng }));
                }}
              />
            </div>
            
            <div>
              <Label htmlFor="bio" className="mb-2 block">Descripción</Label>
              <textarea
                id="bio"
                placeholder="Cuéntanos un poco sobre ti..."
                className="w-full flex min-h-[100px] rounded-xl border border-input bg-transparent px-3 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border bg-muted/20 shrink-0 flex justify-end">
           <Button type="button" variant="outline" className="mr-3 rounded-xl h-10" onClick={() => onOpenChange(false)}>
             Cancelar
           </Button>
            <Button 
              type="submit" 
              form="edit-profile-form" 
              disabled={loading || uploading} 
              className="rounded-xl h-10 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? "Guardando..." : uploading ? "Subiendo..." : "Guardar"}
            </Button>
        </div>
      </div>
    </div>
  );
}
