const fs = require('fs');

const path = "c:\\Users\\donat\\Desktop\\Ingenieria Multimedia\\Ussabilidad y Accesibilidad\\MultiMeet\\src\\app\\item\\[id]\\page.jsx";
let content = fs.readFileSync(path, 'utf8');

// Normalize newlines in content and search strings for easy matching
content = content.replace(/\r\n/g, '\n');

// Modals to update
const updates = [
  { // Participants Modal
    from: `<div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="px-6 py-5 border-b border-border flex justify-between items-center">
              <h3 className="text-xl font-bold">Participantes ({event.participants?.length || 0})</h3>
              <button
                onClick={() => setShowParticipantsModal(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >`,
    to: `<div
            ref={trapParticipants}
            role="dialog"
            aria-modal="true"
            aria-labelledby="participants-title"
            className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="px-6 py-5 border-b border-border flex justify-between items-center">
              <h3 id="participants-title" className="text-xl font-bold">Participantes ({event.participants?.length || 0})</h3>
              <button
                onClick={() => setShowParticipantsModal(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Cerrar"
              >`
  },
  { // Delete Modal 1
    from: `<div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-event-title"
            className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-3xl overflow-hidden"
          >`,
    to: `<div
            ref={trapDelete}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-event-title"
            className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-3xl overflow-hidden"
          >`
  },
  { // Finish Modal
    from: `<div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowFinishModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 text-destructive">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">¿Finalizar evento?</h3>`,
    to: `<div ref={trapFinish} role="dialog" aria-modal="true" aria-labelledby="finish-title" className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowFinishModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 text-destructive">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 id="finish-title" className="text-xl font-bold text-foreground">¿Finalizar evento?</h3>`
  },
  { // Join Modal
    from: `<div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowJoinModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
                <UserPlus className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">¿Apuntarse al evento?</h3>`,
    to: `<div ref={trapJoin} role="dialog" aria-modal="true" aria-labelledby="join-title" className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowJoinModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
                <UserPlus className="w-8 h-8" />
              </div>
              <h3 id="join-title" className="text-xl font-bold text-foreground">¿Apuntarse al evento?</h3>`
  },
  { // Leave Modal
    from: `<div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowLeaveModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 text-destructive">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">¿Desapuntarse del evento?</h3>`,
    to: `<div ref={trapLeave} role="dialog" aria-modal="true" aria-labelledby="leave-title" className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowLeaveModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 text-destructive">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 id="leave-title" className="text-xl font-bold text-foreground">¿Desapuntarse del evento?</h3>`
  },
  { // Rate Modal
    from: `<div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowRateModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">¿Valorar evento?</h3>`,
    to: `<div ref={trapRate} role="dialog" aria-modal="true" aria-labelledby="rate-title" className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowRateModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
                <Star className="w-8 h-8" />
              </div>
              <h3 id="rate-title" className="text-xl font-bold text-foreground">¿Valorar evento?</h3>`
  },
  { // Delete Media Modal
    from: `<div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowDeleteMediaModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 text-destructive">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">¿Eliminar multimedia?</h3>`,
    to: `<div ref={trapDeleteMedia} role="dialog" aria-modal="true" aria-labelledby="delete-media-title" className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowDeleteMediaModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 text-destructive">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 id="delete-media-title" className="text-xl font-bold text-foreground">¿Eliminar multimedia?</h3>`
  },
  { // Delete Modal 2
    from: `<div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 text-destructive">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground">¿Eliminar evento?</h3>`,
    to: `<div ref={trapDelete} role="dialog" aria-modal="true" aria-labelledby="delete-event-title-2" className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 text-destructive">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 id="delete-event-title-2" className="text-xl font-bold text-foreground">¿Eliminar evento?</h3>`
  }
];

let changedCount = 0;
for (const update of updates) {
  if (content.includes(update.from)) {
    content = content.replace(update.from, update.to);
    changedCount++;
  } else {
    console.log("Could not find:", update.from.slice(0, 50));
  }
}

// Write back with CRLF as standard in Windows
fs.writeFileSync(path, content.replace(/\n/g, '\r\n'));
console.log("Updated", changedCount, "occurrences.");
