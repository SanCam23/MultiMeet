"use client";

import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export function EditProfileDialog({ open, onOpenChange, userData, onSaveSuccess }) {
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    avatar: "",
    location: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      if (userData) {
        setFormData({
          username: userData.username || "",
          bio: userData.bio || "",
          avatar: userData.avatar || "",
          location: userData.location || "",
        });
      }
    } else {
      document.body.style.overflow = "unset";
      setError("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open, userData]);

  if (!open) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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
          <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100/20 border border-red-500/50 text-red-500 rounded-xl text-sm text-center">
                {error}
              </div>
            )}
            
            <div>
              <Label htmlFor="avatar" className="mb-2 block">Foto de Perfil (URL)</Label>
              <Input
                id="avatar"
                type="url"
                placeholder="https://ejemplo.com/foto.jpg"
                className="h-12 rounded-xl"
                value={formData.avatar}
                onChange={handleChange}
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
              <Input
                id="location"
                type="text"
                placeholder="Ciudad, País"
                className="h-12 rounded-xl"
                value={formData.location}
                onChange={handleChange}
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
           <Button type="submit" form="edit-profile-form" disabled={loading} className="rounded-xl h-10 flex items-center gap-2">
             <Save className="w-4 h-4" />
             {loading ? "Guardando..." : "Guardar"}
           </Button>
        </div>
      </div>
    </div>
  );
}
