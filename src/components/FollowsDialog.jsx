"use client";

import { useState } from "react";
import { X, UserX, UserMinus, Loader2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/Button";

/**
 * Dialog to show lists of followers or people you follow.
 * @param {boolean} open Whether the dialog is open.
 * @param {function} onOpenChange Callback when the open state changes.
 * @param {string} type "followers" or "following".
 * @param {Array} list Initial list of user objects.
 * @param {function} onRefresh Callback to refresh the parent's data.
 */
export function FollowsDialog({ open, onOpenChange, type, list = [], onRefresh }) {
  const { theme } = useTheme();
  const [loadingId, setLoadingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  if (!open) return null;

  const isFollowingList = type === "following";
  const title = isFollowingList ? "Siguiendo" : "Seguidores";

  const filteredList = list.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = async (targetId, e) => {
    e.preventDefault();
    setLoadingId(targetId);

    const apiPath = isFollowingList 
        ? `/api/user/${targetId}/follow` // POST to follow/unfollow
        : `/api/user/${targetId}/remove-follower`; // POST to remove someone from MY followers

    try {
      const res = await fetch(apiPath, { method: "POST" });
      if (res.ok) {
        if (onRefresh) await onRefresh();
      } else {
        const error = await res.json();
        alert(error.message || "Algo salió mal.");
      }
    } catch (error) {
      console.error("Error updating following/followers:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      
      <div 
        role="dialog" 
        className="relative w-full max-w-[450px] bg-card border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col m-4 max-h-[80vh] animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0 bg-card">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-border bg-muted/10 shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre o usuario..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredList.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              <p>{searchQuery ? "No se encontraron resultados." : `No tienes ${title.toLowerCase()} todavía.`}</p>
            </div>
          ) : (
            filteredList.map((u) => {
              const name = u.name || "Usuario";
              const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

              return (
              <div key={u._id} className="flex items-center gap-4 group p-2 hover:bg-muted/30 rounded-2xl transition-colors">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-border bg-muted flex items-center justify-center">
                  {u.avatar ? (
                    <img src={u.avatar} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-semibold">{initials}</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{name}</p>
                  <p className="text-xs text-muted-foreground truncate">{u.username}</p>
                </div>

                <Button
                  onClick={(e) => handleAction(u._id, e)}
                  disabled={loadingId === u._id}
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs h-9 px-4 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all"
                >
                  {loadingId === u._id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : isFollowingList ? (
                    <>
                      <UserMinus className="w-3.5 h-3.5 mr-1.5" />
                      Dejar de seguir
                    </>
                  ) : (
                    <>
                      <UserX className="w-3.5 h-3.5 mr-1.5" />
                      Eliminar
                    </>
                  )}
                </Button>
              </div>
            )})
          )}
        </div>
      </div>
    </div>
  );
}
