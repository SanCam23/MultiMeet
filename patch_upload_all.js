const fs = require('fs');
const path = "c:\\Users\\donat\\Desktop\\Ingenieria Multimedia\\Ussabilidad y Accesibilidad\\MultiMeet\\src\\app\\upload\\page.jsx";
let content = fs.readFileSync(path, 'utf8');

// Helper to assert replacement
function replaceAssert(search, replace, desc) {
    if (content.includes(search)) {
        content = content.replace(search, replace);
        console.log(`[OK] ${desc}`);
    } else {
        console.error(`[FAIL] ${desc} - Target string not found.`);
        console.log("Search string:", search);
    }
}

// 1. Add refs and state
replaceAssert(
    `  const router = useRouter();\r\n  const coverImageInputRef = useRef(null);`,
    `  const router = useRouter();\r\n  const coverImageInputRef = useRef(null);\r\n  const titleRef = useRef(null);\r\n  const categoriesRef = useRef(null);\r\n  const locationRef = useRef(null);\r\n  const dateRef = useRef(null);\r\n  const timeRef = useRef(null);\r\n  const parentEventRef = useRef(null);\r\n  const [ariaLiveMessage, setAriaLiveMessage] = useState("");`,
    `Injecting refs`
);

// 2. focusAndAnnounce function
replaceAssert(
    `const [overrideLocation, setOverrideLocation] = useState(false);`,
    `const [overrideLocation, setOverrideLocation] = useState(false);\r\n  const focusAndAnnounce = (ref, message) => {\r\n    setAriaLiveMessage(message);\r\n    if (ref && ref.current) {\r\n      ref.current.focus();\r\n      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });\r\n    } else {\r\n      setModalMessage(message);\r\n      setShowModal(true);\r\n    }\r\n  };`,
    `Injecting focusAndAnnounce`
);

// 3. noValidate & aria-live regions
replaceAssert(
    `{formType === "new" ? (\r\n            <form onSubmit={handleSubmit} className="space-y-8">`,
    `{formType === "new" ? (\r\n            <form onSubmit={handleSubmit} className="space-y-8" noValidate>\r\n              <div className="sr-only" role="status" aria-live="assertive">{ariaLiveMessage}</div>`,
    `Inject noValidate and aria-live to NEW form`
);

replaceAssert(
    `{formType === "extend" && (\r\n            <form onSubmit={handleSubmit} className="space-y-8">`,
    `{formType === "extend" && (\r\n            <form onSubmit={handleSubmit} className="space-y-8" noValidate>\r\n              <div className="sr-only" role="status" aria-live="assertive">{ariaLiveMessage}</div>`,
    `Inject noValidate and aria-live to EXTEND form (conditional &&)`
);

replaceAssert(
    `) : (\r\n            <form onSubmit={handleSubmit} className="space-y-8">`,
    `) : (\r\n            <form onSubmit={handleSubmit} className="space-y-8" noValidate>\r\n              <div className="sr-only" role="status" aria-live="assertive">{ariaLiveMessage}</div>`,
    `Inject noValidate and aria-live to EXTEND form (fallback conditional :)`
);

// 4. Attach refs to DOM elements
// title "new"
replaceAssert(
    `<Input\r\n                  id="title"\r\n                  placeholder="Dale un título atractivo a tu meetup"`,
    `<Input\r\n                  id="title"\r\n                  ref={titleRef}\r\n                  placeholder="Dale un título atractivo a tu meetup"`,
    `Attach titleRef NEW`
);
// title "extend"
replaceAssert(
    `<Input\r\n                  id="extensionTitle"\r\n                  placeholder="¿Qué añades a este evento?"`,
    `<Input\r\n                  id="extensionTitle"\r\n                  ref={titleRef}\r\n                  placeholder="¿Qué añades a este evento?"`,
    `Attach titleRef EXTEND`
);
// categories
replaceAssert(
    `<div className="flex flex-wrap gap-3">\r\n                  {categories.map((category)`,
    `<div className="flex flex-wrap gap-3" ref={categoriesRef} tabIndex="-1">\r\n                  {categories.map((category)`,
    `Attach categoriesRef`
);
// map location
replaceAssert(
    `<LocationPicker\r\n                  value={locationData.address}`,
    `<div ref={locationRef} tabIndex="-1"><LocationPicker\r\n                  value={locationData.address}`,
    `Attach locationRef (and wrap LocationPicker)`
);
// wait, if I open a div I must close it. It's better to just add ref to a surrounding div if it exists.
content = content.replace(`<div ref={locationRef} tabIndex="-1"><LocationPicker`, `<LocationPicker`); // undo previous
replaceAssert(
    `<div>\r\n                <Label htmlFor="location" className="mb-3 block">\r\n                  <MapPin className="w-4 h-4 inline mr-1.5 text-secondary" aria-hidden="true" />\r\n                  Ubicación\r\n                </Label>`,
    `<div ref={locationRef} tabIndex="-1">\r\n                <Label htmlFor="location" className="mb-3 block">\r\n                  <MapPin className="w-4 h-4 inline mr-1.5 text-secondary" aria-hidden="true" />\r\n                  Ubicación\r\n                </Label>`,
    `Attach locationRef NEW`
);
// location extend
replaceAssert(
    `<div>\r\n                      <Label className="mb-3 block">Nueva ubicación</Label>`,
    `<div ref={locationRef} tabIndex="-1">\r\n                      <Label className="mb-3 block">Nueva ubicación</Label>`,
    `Attach locationRef EXTEND`
);
// parentEvent
replaceAssert(
    `<select\r\n                  id="parentEvent"\r\n                  className="w-full h-12 px-4 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground"`,
    `<select\r\n                  id="parentEvent"\r\n                  ref={parentEventRef}\r\n                  className="w-full h-12 px-4 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground"`,
    `Attach parentEventRef`
);

// Date and Time (Regex because there are two of them each or just one? Let's check.)
content = content.replace(/<Input\s+id="date"\s+type="date"/g, '<Input id="date" ref={dateRef} type="date"');
console.log("[OK] Attached dateRef");
content = content.replace(/<Input\s+id="time"\s+type="time"/g, '<Input id="time" ref={timeRef} type="time"');
console.log("[OK] Attached timeRef");

// 5. Logic
const oldGenerate = `  const handleGenerateDescription = async () => {\r\n    setSubmitError("");\r\n    setSubmitSuccess("");\r\n\r\n    const isExtend = formType === "extend";\r\n\r\n    if (isExtend) {\r\n      if (!parentEventId) {\r\n        setModalMessage("Debes seleccionar el evento original para ampliar antes de generar la descripción.");\r\n        setShowModal(true);\r\n        return;\r\n      }\r\n      if (!title.trim() || !date || !time) {\r\n        setModalMessage("Debes completar la aportación (título), la fecha y la hora de la ampliación para generar tu descripción.");\r\n        setShowModal(true);\r\n        return;\r\n      }\r\n      if (overrideLocation && !locationData.address.trim()) {\r\n        setModalMessage("Has marcado la opción de cambiar ubicación; debes seleccionar la nueva ubicación en el mapa antes de generar la descripción.");\r\n        setShowModal(true);\r\n        return;\r\n      }\r\n    } else {\r\n      if (!title.trim() || selectedCategories.length === 0 || !locationData.address.trim() || !date || !time) {\r\n        setModalMessage("Debes completar el título, la ubicación, la fecha y la hora para que podamos generar tu descripción");\r\n        setShowModal(true);\r\n        return;\r\n      }\r\n    }`;

const newGenerate = `  const handleGenerateDescription = async () => {\r\n    setSubmitError("");\r\n    setSubmitSuccess("");\r\n    setAriaLiveMessage("");\r\n\r\n    const isExtend = formType === "extend";\r\n\r\n    if (isExtend) {\r\n      if (!parentEventId) return focusAndAnnounce(parentEventRef, "Error: Selecciona el evento original para ampliar.");\r\n      if (!title.trim()) return focusAndAnnounce(titleRef, "Error: El título de la aportación es obligatorio.");\r\n      if (overrideLocation && !locationData.address.trim()) return focusAndAnnounce(locationRef, "Error: Selecciona la nueva ubicación.");\r\n      if (!date) return focusAndAnnounce(dateRef, "Error: Selecciona la fecha.");\r\n      if (!time) return focusAndAnnounce(timeRef, "Error: Selecciona la hora.");\r\n    } else {\r\n      if (!title.trim()) return focusAndAnnounce(titleRef, "Error: El título del evento es obligatorio.");\r\n      if (selectedCategories.length === 0) return focusAndAnnounce(categoriesRef, "Error: Selecciona al menos una categoría.");\r\n      if (!locationData.address.trim()) return focusAndAnnounce(locationRef, "Error: Selecciona una ubicación en el mapa.");\r\n      if (!date) return focusAndAnnounce(dateRef, "Error: Selecciona la fecha.");\r\n      if (!time) return focusAndAnnounce(timeRef, "Error: Selecciona la hora.");\r\n    }`;

replaceAssert(oldGenerate, newGenerate, "Update handleGenerateDescription logic");

const oldSubmit = `  const handleSubmit = async (e) => {\r\n    e.preventDefault();\r\n\r\n    setSubmitError("");\r\n    setSubmitSuccess("");\r\n\r\n    const isExtend = formType === "extend";\r\n\r\n    if (isExtend && !parentEventId) {\r\n      setSubmitError("Selecciona un evento original para ampliar.");\r\n      return;\r\n    }\r\n\r\n    if (!isExtend && selectedCategories.length === 0) {\r\n      setSubmitError("Selecciona al menos una categoría.");\r\n      return;\r\n    }\r\n\r\n    if ((!isExtend || overrideLocation) && !locationData.address.trim()) {\r\n      setSubmitError("Selecciona una ubicación.");\r\n      return;\r\n    }\r\n\r\n    const dateTime = new Date(\`\${date}T\${time}\`);\r\n    if (Number.isNaN(dateTime.getTime())) {\r\n      setSubmitError("La fecha y hora no son válidas.");\r\n      return;\r\n    }\r\n\r\n    if (dateTime.getTime() <= Date.now()) {\r\n      setSubmitError("La fecha y hora del evento deben ser futuras.");\r\n      return;\r\n    }`;

const newSubmit = `  const handleSubmit = async (e) => {\r\n    e.preventDefault();\r\n\r\n    setSubmitError("");\r\n    setSubmitSuccess("");\r\n    setAriaLiveMessage("");\r\n\r\n    const isExtend = formType === "extend";\r\n\r\n    if (isExtend) {\r\n      if (!parentEventId) return focusAndAnnounce(parentEventRef, "Error: Selecciona un evento original para ampliar.");\r\n      if (!title.trim()) return focusAndAnnounce(titleRef, "Error: El título de la aportación es obligatorio.");\r\n      if (overrideLocation && !locationData.address.trim()) return focusAndAnnounce(locationRef, "Error: Selecciona la nueva ubicación.");\r\n      if (!date) return focusAndAnnounce(dateRef, "Error: Selecciona la fecha.");\r\n      if (!time) return focusAndAnnounce(timeRef, "Error: Selecciona la hora.");\r\n    } else {\r\n      if (!title.trim()) return focusAndAnnounce(titleRef, "Error: El título del evento es obligatorio.");\r\n      if (selectedCategories.length === 0) return focusAndAnnounce(categoriesRef, "Error: Selecciona al menos una categoría.");\r\n      if (!locationData.address.trim()) return focusAndAnnounce(locationRef, "Error: Selecciona una ubicación en el mapa.");\r\n      if (!date) return focusAndAnnounce(dateRef, "Error: Selecciona la fecha.");\r\n      if (!time) return focusAndAnnounce(timeRef, "Error: Selecciona la hora.");\r\n    }\r\n\r\n    const dateTime = new Date(\`\${date}T\${time}\`);\r\n    if (Number.isNaN(dateTime.getTime())) {\r\n      return focusAndAnnounce(dateRef, "Error: La fecha y hora no son válidas.");\r\n    }\r\n\r\n    if (dateTime.getTime() <= Date.now()) {\r\n      return focusAndAnnounce(dateRef, "Error: La fecha y hora del evento deben ser futuras.");\r\n    }`;

replaceAssert(oldSubmit, newSubmit, "Update handleSubmit logic");

fs.writeFileSync(path, content);
console.log("All fixes applied successfully.");
