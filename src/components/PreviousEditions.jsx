"use client";

import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";

export function PreviousEditions({ editions }) {
  const router = useRouter();

  if (!editions || editions.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">Ediciones anteriores</h3>
        <span className="text-sm text-muted-foreground">
          {editions.length} {editions.length === 1 ? 'edición' : 'ediciones'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {editions.map((edition) => (
          <button
            key={edition.id}
            onClick={() => router.push(`/item/${edition.id}`)}
            className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary transition-all hover:shadow-lg text-left"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={edition.image}
                alt={edition.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <div className="bg-primary text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                  {edition.year}
                </div>
              </div>
            </div>
            <div className="p-5">
              <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                {edition.title}
              </h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                <span>{edition.date}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {edition.participants.toLocaleString()} participantes
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
