"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, UserPlus, Calendar, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";

const getNotificationIcon = (type) => {
  switch (type) {
    case "follow": return <UserPlus className="w-4 h-4" />;
    case "eventJoin": return <Calendar className="w-4 h-4" />;
    case "photoUpload": return <MessageCircle className="w-4 h-4" />;
    default: return <Bell className="w-4 h-4" />;
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case "follow": return "bg-accent text-accent-foreground";
    case "eventJoin": return "bg-primary text-primary-foreground";
    case "photoUpload": return "bg-secondary text-secondary-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const getNotificationText = (notification) => {
  const senderName = notification.sender?.name || "Un usuario";
  const eventTitle = notification.event?.title || "tu evento";

  switch (notification.type) {
    case "follow":
      return {
        title: "Nuevo seguidor",
        message: `${senderName} ha empezado a seguirte`
      };
    case "eventJoin":
      return {
        title: "Nueva inscripción",
        message: `${senderName} se ha unido a ${eventTitle}`
      };
    case "photoUpload":
      return {
        title: "Nueva foto",
        message: `${senderName} ha subido una foto a ${eventTitle}`
      };
    default:
      return {
        title: "Notificación",
        message: "Tienes una nueva actualización"
      };
  }
};

const getRelativeTime = (date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Ahora mismo";
  if (minutes < 60) return `hace ${minutes}m`;
  if (hours < 24) return `hace ${hours}h`;
  if (days < 7) return `hace ${days}d`;
  return date.toLocaleDateString();
};

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const { theme } = useTheme();
  const isHighContrast = theme === "high-contrast";

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        body: JSON.stringify({ id }),
      });
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      }, 400);
    } catch (err) {
      console.error("Error updating notification:", err);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setTimeout(() => {
        setNotifications([]);
      }, 400);
    } catch (err) {
      console.error("Error updating all notifications:", err);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-muted/50 rounded-full transition-colors group focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Notificaciones"
        aria-expanded={isOpen}
      >
        <Bell className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className={`absolute top-1.5 right-1.5 w-5 h-5 bg-primary rounded-full ${isHighContrast ? "text-black" : "text-white"} text-xs font-semibold flex items-center justify-center shadow-lg animate-pulse`}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-x-4 top-16 md:absolute md:top-full md:right-0 md:left-auto md:mt-2 md:w-[420px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 zoom-in-95 duration-200 origin-top-right">
          {/* Header */}
          <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">Notificaciones</h3>
                {unreadCount > 0 && (
                  <Badge className={`bg-primary flex items-center justify-center ${isHighContrast ? "text-black" : "text-white"} h-6 px-2.5 rounded-full shadow-sm`}>
                    {unreadCount}
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-primary hover:text-primary font-medium hover:bg-primary/10 h-8 px-3 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  Marcar todo como leído
                </button>
              )}
            </div>
          </div>

          {/* List */}
          {notifications.length === 0 ? (
            <div className="py-16 px-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Bell className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
              </div>
              <p className="font-medium text-foreground mb-1">¡Todo al día!</p>
              <p className="text-muted-foreground text-sm">Has leído todas tus notificaciones</p>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto scrollbar-hide py-2">
              {notifications.map((notification, index) => {
                const { title, message } = getNotificationText(notification);
                return (
                  <div key={notification._id} className="relative">
                    <div
                      tabIndex={0}
                      role="button"
                      className={`px-6 py-4 hover:bg-muted/30 transition-all cursor-pointer focus:outline-none focus:bg-muted/30 flex gap-4 ${
                        !notification.read ? "bg-primary/5 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                      }`}
                      onClick={() => markAsRead(notification._id)}
                      onKeyDown={(e) => e.key === "Enter" && markAsRead(notification._id)}
                    >
                      <div className="flex-shrink-0">
                        {notification.sender?.avatar ? (
                          <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-background ring-transparent hover:ring-primary/20 transition-all">
                             <img src={notification.sender.avatar} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-sm ${getNotificationColor(notification.type)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{title}</h4>
                          {!notification.read && (
                            <div className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0 mt-1 animate-pulse" aria-label="No leída"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {message}
                        </p>
                        <p className="text-xs font-medium text-muted-foreground/80">
                          {getRelativeTime(new Date(notification.createdAt))}
                        </p>
                      </div>
                    </div>
                    {index < notifications.length - 1 && (
                      <div className="h-px bg-border mx-6 my-1" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
