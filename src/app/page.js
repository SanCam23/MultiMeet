"use client";

import { useState } from "react";
import { EventCard } from "@/components/EventCard";
import { mockEvents } from "@/data/events";
import { useTheme } from "@/context/ThemeContext";

const tabs = [
  { value: "following", label: "Siguiendo" },
  { value: "topInCity", label: "Top Ciudad" },
  { value: "topGlobal", label: "Top Global" },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("following");
  const { theme } = useTheme();
  const isHighContrast = theme === "high-contrast";

  return (
    <section aria-label="Eventos">
      <div className="w-full mx-auto px-6 md:px-8 lg:px-12 pt-6 pb-8 max-w-[1440px]">
        {/* Tabs */}
        <div className="max-w-2xl mx-auto mb-8" role="tablist" aria-label="Categorías de eventos">
          <div className="grid w-full grid-cols-3 h-12 bg-card rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                role="tab"
                aria-selected={activeTab === tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`rounded-lg text-sm md:text-base font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring ${
                  activeTab === tab.value
                    ? `bg-primary ${isHighContrast ? "text-black" : "text-primary-foreground"} shadow-sm`
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Event Grid */}
        <div
          role="tabpanel"
          aria-label={tabs.find((t) => t.value === activeTab)?.label}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8"
        >
          {mockEvents[activeTab].map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </div>
    </section>
  );
}
