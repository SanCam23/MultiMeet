import { Calendar, Users } from "lucide-react";

export function PreviousEditions({ editions }) {
  if (!editions || editions.length === 0) return null;

  return (
    <section className="mb-10" aria-label="Versiones anteriores del evento">
      <h2 className="text-xl font-bold mb-4">Versiones Anteriores</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {editions.map((edition) => (
          <div 
            key={edition.id} 
            className="flex-shrink-0 w-64 md:w-72 bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col snap-start"
          >
            <div className="relative h-36">
              <img 
                src={edition.image} 
                alt={`Imagen de ${edition.title}`} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-foreground">
                {edition.year}
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-sm mb-2 line-clamp-2">{edition.title}</h3>
              <div className="mt-auto space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  <span>{edition.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  <span>{edition.participants.toLocaleString()} asistentes</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
