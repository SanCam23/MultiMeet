"use client";

import { useState } from "react";
import { Settings, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EventCard } from "@/components/EventCard";
import { SettingsDialog } from "@/components/SettingsDialog";

const mockUserData = {
  name: "Sarah Johnson",
  username: "@sarahj",
  bio: "Tech enthusiast | Coffee lover | Always up for a good meetup",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  location: "San Francisco, CA",
  followers: 342,
  following: 128,
};

const mockPersonalEvents = [
  {
    id: "p1",
    image: "https://images.unsplash.com/photo-1760642626994-8ebd037f78dc?w=400",
    title: "Weekly Book Club",
    date: "Feb 22, 2026",
    time: "6:00 PM",
    location: "Local Library, SF",
    participants: 8,
    category: "Books",
  },
];

const mockJoinedEvents = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1760642626994-8ebd037f78dc?w=400",
    title: "Tech Networking Night",
    date: "Feb 15, 2026",
    time: "7:00 PM",
    location: "Downtown Tech Hub",
    participants: 45,
    category: "Tech",
  },
];

const mockPastEvents = [
  {
    id: "finished-1",
    image: "https://images.unsplash.com/photo-1672841821756-fc04525771c2?w=400",
    title: "Summer Music Fest 2025",
    date: "Aug 10, 2025",
    time: "4:00 PM",
    location: "Golden Gate Park",
    participants: 156,
    category: "Music",
  },
];

export default function DashboardPage() {
  const [mainTab, setMainTab] = useState("posts");
  const [subTab, setSubTab] = useState("personal");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Profile Header */}
      <section className="bg-card border-b border-border" aria-label="Perfil de usuario">
        <div className="w-full mx-auto px-6 md:px-8 lg:px-12 py-8 max-w-[1440px]">
          <div className="max-w-2xl mx-auto lg:mx-0">
            <div className="flex items-start gap-5 mb-6">
              <div aria-hidden="true" className="w-24 h-24 rounded-full border-4 border-secondary/20 overflow-hidden bg-primary/10 flex-shrink-0">
                <img src={mockUserData.avatar} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">{mockUserData.name}</h2>
                <p className="text-muted-foreground text-sm mb-3">
                  {mockUserData.username}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-secondary" aria-hidden="true" />
                  <span>{mockUserData.location}</span>
                </div>
              </div>
            </div>

            <p className="text-sm mb-6 leading-relaxed">{mockUserData.bio}</p>

            <div className="flex gap-8 mb-6">
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">{mockUserData.followers}</p>
                <p className="text-sm text-muted-foreground">Seguidores</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">{mockUserData.following}</p>
                <p className="text-sm text-muted-foreground">Siguiendo</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 md:flex-initial md:px-8 h-12 rounded-xl">
                Editar perfil
              </Button>
              <Button variant="outline" size="icon" aria-label="Ajustes" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
                <Settings className="w-5 h-5 text-primary" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Settings Modal */}
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />

      {/* Tabs and Content */}
      <section className="w-full mx-auto px-6 md:px-8 lg:px-12 pt-6 pb-8 max-w-[1440px]" aria-label="Contenido del usuario">
        
        {/* Main Tablist */}
        <div className="max-w-md mx-auto mb-6 md:max-w-none md:flex md:justify-center md:gap-6" role="tablist">
          <div className="grid grid-cols-2 h-12 bg-card rounded-xl p-1 w-full md:w-64 mb-4 md:mb-0">
            <button
              role="tab"
              aria-selected={mainTab === "posts"}
              onClick={() => { setMainTab("posts"); setSubTab("personal"); }}
              className={`rounded-lg transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                mainTab === "posts" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mis posts
            </button>
            <button
              role="tab"
              aria-selected={mainTab === "timeline"}
              onClick={() => { setMainTab("timeline"); setSubTab("upcoming"); }}
              className={`rounded-lg transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                mainTab === "timeline" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Historial
            </button>
          </div>

          {/* Sub Tablist based on Main Tab */}
          <div className="grid grid-cols-2 h-11 bg-card rounded-lg p-0.5 w-full md:w-56" role="tablist">
            {mainTab === "posts" ? (
              <>
                <button
                  role="tab"
                  aria-selected={subTab === "personal"}
                  onClick={() => setSubTab("personal")}
                  className={`rounded-md transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                    subTab === "personal" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  Personal
                </button>
                <button
                  role="tab"
                  aria-selected={subTab === "joined"}
                  onClick={() => setSubTab("joined")}
                  className={`rounded-md transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                    subTab === "joined" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  Apuntado
                </button>
              </>
            ) : (
              <>
                <button
                  role="tab"
                  aria-selected={subTab === "upcoming"}
                  onClick={() => setSubTab("upcoming")}
                  className={`rounded-md transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                    subTab === "upcoming" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  Próximos
                </button>
                <button
                  role="tab"
                  aria-selected={subTab === "past"}
                  onClick={() => setSubTab("past")}
                  className={`rounded-md transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                    subTab === "past" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  Pasados
                </button>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8 mt-6">
          {(mainTab === "posts" && subTab === "personal" ? mockPersonalEvents : 
            mainTab === "posts" && subTab === "joined" ? mockJoinedEvents :
            mainTab === "timeline" && subTab === "upcoming" ? mockJoinedEvents :
            mockPastEvents).map((event) => (
             <EventCard key={event.id} {...event} />
          ))}
        </div>
      </section>
    </div>
  );
}
