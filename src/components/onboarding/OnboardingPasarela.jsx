"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { MapPin, Sun, Moon, Eye, Type, ChevronRight, Loader2, Sparkles, User } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
    ssr: false,
    loading: () => <div className="h-[250px] w-full bg-muted animate-pulse rounded-2xl" />,
});

const steps = [
    {
        id: "welcome",
        title: "¡Bienvenido a MultiMeet!",
        description: "Estamos encantados de tenerte aquí. Vamos a configurar tu experiencia en unos pocos pasos.",
        icon: Sparkles,
    },
    {
        id: "username",
        title: "Elige tu nombre de usuario",
        description: "MultiMeet te identificará con este nombre único para que tus amigos puedan encontrarte.",
        icon: User,
    },
    {
        id: "location",
        title: "¿Dónde estás?",
        description: "MultiMeet te ayudará a encontrar eventos cerca de ti. Dinos tu ubicación predeterminada.",
        icon: MapPin,
    },
    {
        id: "appearance",
        title: "Personaliza tu vista",
        description: "Elige el modo que te resulte más cómodo para navegar por la aplicación.",
        icon: Eye,
    },
    {
        id: "text-size",
        title: "Tamaño de lectura",
        description: "¿Prefieres que los textos sean un poco más grandes para leer mejor?",
        icon: Type,
    },
];

export function OnboardingPasarela({ onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);
    const { userId } = useAuth();
    const { theme, setTheme, largeText, setLargeText } = useTheme();

    const [locationData, setLocationData] = useState({
        address: "",
        lat: null,
        lng: null,
    });
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [currentUserProfile, setCurrentUserProfile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("/api/user/profile");
                if (response.ok) {
                    const data = await response.json();
                    setCurrentUserProfile(data);
                    if (data.username) {
                        setUsername(data.username.startsWith("@") ? data.username.slice(1) : data.username);
                    } else if (data.name) {
                        const suggested = data.name.toLowerCase().trim()
                            .replace(/[^a-z0-9_-]/g, "")
                            .slice(0, 15);
                        setUsername(suggested);
                    }
                }
            } catch (error) {
                console.error("Error fetching profile in onboarding:", error);
            }
        };
        fetchProfile();
    }, []);

    const validateUsername = async (value) => {
        if (!value || value.trim().length === 0) {
            setUsernameError("El nombre de usuario no puede estar vacío.");
            return false;
        }
        if (value.length < 3) {
            setUsernameError("El nombre de usuario debe tener al menos 3 caracteres.");
            return false;
        }
        if (value.length > 20) {
            setUsernameError("El nombre de usuario no puede tener más de 20 caracteres.");
            return false;
        }
        
        setIsCheckingUsername(true);
        try {
            const response = await fetch(`/api/user/username/${value}`);
            if (response.ok) {
                const foundUser = await response.json();
                if (currentUserProfile && foundUser._id === currentUserProfile._id) {
                    return true;
                }
                setUsernameError("Este nombre de usuario ya está en uso.");
                return false;
            } else if (response.status === 404) {
                return true;
            } else {
                setUsernameError("Error al verificar la disponibilidad. Inténtalo de nuevo.");
                return false;
            }
        } catch (error) {
            console.error("Error al verificar nombre de usuario:", error);
            setUsernameError("Error al verificar la disponibilidad.");
            return false;
        } finally {
            setIsCheckingUsername(false);
        }
    };

    const nextStep = async () => {
        const step = steps[currentStep];
        if (step.id === "username") {
            const isValid = await validateUsername(username);
            if (!isValid) return;
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleFinish();
        }
    };

    const handleFinish = async () => {
        setIsSaving(true);
        try {
            // Guardar ubicación, username y preferencias
            const response = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username ? (username.startsWith("@") ? username : `@${username}`) : "",
                    location: locationData.address,
                    lat: locationData.lat,
                    lng: locationData.lng,
                    preferences: {
                        theme: theme,
                        largeText: largeText,
                    },
                    onboardingCompleted: true, // Marcamos que ha terminado
                }),
            });

            if (response.ok) {
                // Disparar evento global para que el Home sepa que ya hay ubicación
                window.dispatchEvent(new Event("profileUpdated"));
                onComplete();
            }
        } catch (error) {
            console.error("Error al guardar onboarding:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSkip = async () => {
        setIsSaving(true);
        try {
            const response = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    location: "",
                    lat: null,
                    lng: null,
                    preferences: {
                        theme: "light",
                        largeText: false,
                    },
                    onboardingCompleted: true,
                }),
            });

            if (response.ok) {
                setTheme("light");
                setLargeText(false);
                window.dispatchEvent(new Event("profileUpdated"));
                onComplete();
            }
        } catch (error) {
            console.error("Error al saltar onboarding:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const step = steps[currentStep];
    const Icon = step.icon;

    return (
        <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-6 overflow-y-auto">
            <div className="max-w-md w-full space-y-8 py-8 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center overflow-hidden ${step.id === "welcome" ? "" : "bg-primary/10 text-primary"}`}>
                        {step.id === "welcome" ? (
                            <img src="/logo.png" alt="MultiMeet Logo" className="w-16 h-16 object-contain" />
                        ) : (
                            <Icon className="w-8 h-8" />
                        )}
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">{step.title}</h1>
                        <p className="text-muted-foreground">{step.description}</p>
                    </div>
                </div>

                <div className="py-2">
                    {step.id === "welcome" && (
                        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                            <p className="text-sm italic leading-relaxed">
                                MultiMeet nació para que juntarnos sea más fácil que nunca. Vamos a ayudarte a tener todo listo en menos de 1 minuto.
                            </p>
                        </div>
                    )}

                    {step.id === "username" && (
                        <div className="space-y-4">
                            <div className="relative rounded-3xl border border-border bg-card p-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                                <div className="flex items-center gap-2 px-4">
                                    <span className="text-muted-foreground font-semibold text-xl">@</span>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const cleanVal = val.toLowerCase().replace(/[^a-z0-9_-]/g, "");
                                            setUsername(cleanVal);
                                            setUsernameError("");
                                        }}
                                        placeholder="tu_usuario"
                                        className="w-full bg-transparent border-0 outline-none focus:ring-0 py-3 text-lg font-medium placeholder:text-muted-foreground/30 text-foreground"
                                    />
                                    {isCheckingUsername && (
                                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                    )}
                                </div>
                            </div>
                            {usernameError ? (
                                <p className="text-sm text-destructive text-center font-medium">
                                    {usernameError}
                                </p>
                            ) : (
                                <p className="text-xs text-center text-muted-foreground leading-relaxed">
                                    Tu nombre de usuario debe ser único. Los demás podrán buscarte y mencionarte usando este nombre.
                                </p>
                            )}
                        </div>
                    )}

                    {step.id === "location" && (
                        <div className="space-y-4">
                            <div className="rounded-3xl border border-border overflow-hidden bg-muted shadow-sm">
                                <LocationPicker
                                    value={locationData.address}
                                    lat={locationData.lat}
                                    lng={locationData.lng}
                                    onChange={setLocationData}
                                />
                            </div>
                            {!locationData.address && (
                                <p className="text-xs text-center text-muted-foreground">
                                    Usa el buscador o haz click en el mapa para marcar tu posición.
                                </p>
                            )}
                        </div>
                    )}

                    {step.id === "appearance" && (
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: "light", label: "Claro", icon: Sun },
                                { id: "dark", label: "Oscuro", icon: Moon },
                                { id: "high-contrast", label: "Contraste", icon: Eye },
                            ].map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => setTheme(mode.id)}
                                    className={`flex flex-col items-center gap-3 p-4 rounded-3xl border-2 transition-all ${theme === mode.id
                                        ? "border-primary bg-primary/5 shadow-md"
                                        : "border-border hover:border-primary/20 bg-card"
                                        }`}
                                >
                                    <mode.icon className={`w-6 h-6 ${theme === mode.id ? "text-primary" : "text-muted-foreground"}`} />
                                    <span className="text-xs font-bold uppercase tracking-wider">{mode.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {step.id === "text-size" && (
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setLargeText(false)}
                                className={`flex items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all ${!largeText
                                    ? "border-primary bg-primary/5 shadow-md"
                                    : "border-border hover:border-primary/20 bg-card"
                                    }`}
                            >
                                <div className="flex flex-col items-center">
                                    <span className="text-base font-medium">Estándar</span>
                                    <span className="text-[10px] text-muted-foreground font-mono">16px base</span>
                                </div>
                            </button>
                            <button
                                onClick={() => setLargeText(true)}
                                className={`flex items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all ${largeText
                                    ? "border-primary bg-primary/5 shadow-md"
                                    : "border-border hover:border-primary/20 bg-card"
                                    }`}
                            >
                                <div className="flex flex-col items-center">
                                    <span className="text-xl font-bold">Grande</span>
                                    <span className="text-[10px] text-muted-foreground font-mono">18px base</span>
                                </div>
                            </button>
                        </div>
                    )}
                </div>

                <div className="pt-4 flex flex-col gap-4">
                    <Button
                        size="lg"
                        className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg"
                        onClick={nextStep}
                        disabled={
                            isSaving ||
                            isCheckingUsername ||
                            (step.id === "location" && !locationData.address) ||
                            (step.id === "username" && (!username || username.trim().length < 3))
                        }
                    >
                        {isSaving || isCheckingUsername ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                {currentStep === steps.length - 1 ? "Empezar" : "Siguiente paso"}
                                {currentStep !== steps.length - 1 && <ChevronRight className="w-5 h-5 ml-2" />}
                            </>
                        )}
                    </Button>

                    <button
                        onClick={handleSkip}
                        disabled={isSaving}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium mt-2"
                    >
                        Saltar por ahora (usar valores por defecto)
                    </button>

                    {/* Progress dots */}
                    <div className="flex justify-center gap-2 pt-2">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-2 rounded-full transition-all duration-300 ${currentStep === i ? "w-8 bg-primary" : "w-2 bg-muted"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
