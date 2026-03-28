"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al registrarse");
      }

      router.push("/login?registered=true");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    console.log(`Sign up with ${provider}`);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl">
            <span className="text-white font-bold text-3xl" aria-hidden="true">M</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Únete a MultiMeet</h1>
          <p className="text-muted-foreground">Empieza a conectar con tu comunidad</p>
        </div>

        <section className="bg-card rounded-3xl shadow-xl p-8 md:p-10 border border-border" aria-label="Registro de usuario">
          <h2 className="text-xl font-semibold mb-8">Crea tu cuenta</h2>

          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100/20 border border-red-500/50 text-red-500 rounded-xl text-sm text-center">
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="name" className="mb-2 block">Nombre completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ej. Juan Pérez"
                className="h-12 rounded-xl"
                value={formData.name}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </div>

            <div>
              <Label htmlFor="email" className="mb-2 block">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="h-12 rounded-xl"
                value={formData.email}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </div>

            <div>
              <Label htmlFor="password" className="mb-2 block">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-12 rounded-xl"
                value={formData.password}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl mt-8">
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>

          <div className="relative my-8" aria-hidden="true">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-4 text-muted-foreground font-medium">
                O continúa con
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialSignup("Google")}
              className="h-12 rounded-xl"
              aria-label="Registrarse con Google"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="hidden sm:inline">Google</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialSignup("Apple")}
              className="h-12 rounded-xl"
              aria-label="Registrarse con Apple"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <span className="hidden sm:inline">Apple</span>
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded-sm"
            >
              Inicia sesión
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
