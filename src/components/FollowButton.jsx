"use client";

import { useState, useEffect } from "react";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";

/**
 * Reusable Follow Button component that handles the follow/unfollow logic with the API.
 * @param {string} targetId The MongoDB _id of the user to follow.
 * @param {string} className Optional CSS classes.
 * @param {boolean} initialFollowing Optional initial follow state.
 * @param {function} onFollowToggle Optional callback when following state changes.
 */
export function FollowButton({ 
  targetId: initialTargetId, 
  targetUsername,
  className = "", 
  initialFollowing = false,
  onFollowToggle = null,
  variant = "default",
  size = "default"
}) {
  const { userId } = useAuth();
  const { openSignIn } = useClerk();
  
  const [targetId, setTargetId] = useState(initialTargetId);
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Fetch targetId if not provided, then check status
  useEffect(() => {
    async function resolveAndCheck() {
      // Si no tenemos targetId pero sí username (@o-sin-@), intentamos resolverlo
      let resolvedId = initialTargetId;
      
      if (!resolvedId && targetUsername) {
        try {
          const cleanUsername = targetUsername.startsWith("@") ? targetUsername.slice(1) : targetUsername;
          const res = await fetch(`/api/user/username/${cleanUsername}`);
          if (res.ok) {
            const data = await res.json();
            resolvedId = data._id;
            setTargetId(resolvedId);
          } else {
            // Usuario no existe en DB, no podemos seguirlo
            setIsChecking(false);
            return;
          }
        } catch (error) {
          console.error("Error resolving username:", error);
          setIsChecking(false);
          return;
        }
      }

      if (!userId || !resolvedId) {
        setIsChecking(false);
        return;
      }

      try {
        const res = await fetch(`/api/user/${resolvedId}/follow`);
        if (res.ok) {
          const data = await res.json();
          setIsFollowing(data.isFollowing);
        }
      } catch (error) {
        console.error("Error fetching follow status:", error);
      } finally {
        setIsChecking(false);
      }
    }

    resolveAndCheck();
  }, [userId, initialTargetId, targetUsername]);

  const handleFollowToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      openSignIn();
      return;
    }

    if (!targetId) {
      alert("Este usuario aun no ha sido dado de alta en la base de datos.");
      return;
    };

    setIsLoading(true);
    try {
      const res = await fetch(`/api/user/${targetId}/follow`, {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.isFollowing);
        if (onFollowToggle) {
          onFollowToggle(data.isFollowing, data.followersCount);
        }
      } else {
        const data = await res.json();
        alert(data.error || "Algo salió mal al intentar seguir a este usuario");
      }
    } catch (error) {
      console.error("Error in follow toggle:", error);
      alert("Error de conexión al intentar seguir a este usuario");
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking && userId) {
    return (
      <Button disabled variant="outline" size={size} className={`gap-2 opacity-70 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
        Comprobando...
      </Button>
    );
  }

  return (
    <Button
      onClick={handleFollowToggle}
      disabled={isLoading}
      variant={isFollowing ? "outline" : variant}
      size={size}
      className={`flex items-center gap-2 rounded-full font-medium transition-all transform active:scale-95 ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isFollowing ? (
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
    </Button>
  );
}
