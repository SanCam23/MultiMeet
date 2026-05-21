const fs = require('fs');
const path = "c:\\Users\\donat\\Desktop\\Ingenieria Multimedia\\Ussabilidad y Accesibilidad\\MultiMeet\\src\\app\\upload\\page.jsx";
let content = fs.readFileSync(path, 'utf8');

// Normalize newlines
content = content.replace(/\r\n/g, '\n');

// 1. Add refs and ariaLiveMessage state
const refsToAdd = `  const router = useRouter();
  const coverImageInputRef = useRef(null);
  const titleRef = useRef(null);
  const categoriesRef = useRef(null);
  const locationRef = useRef(null);
  const dateRef = useRef(null);
  const timeRef = useRef(null);
  const parentEventRef = useRef(null);
  const [ariaLiveMessage, setAriaLiveMessage] = useState("");`;

content = content.replace(`  const router = useRouter();\n  const coverImageInputRef = useRef(null);`, refsToAdd);

// 2. Add aria-live div
const ariaLiveDiv = `          {formType === "new" ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="sr-only" role="status" aria-live="assertive">
                {ariaLiveMessage}
              </div>`;
content = content.replace(`          {formType === "new" ? (\n            <form onSubmit={handleSubmit} className="space-y-8">`, ariaLiveDiv);

const ariaLiveDivExtend = `          {formType === "extend" && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="sr-only" role="status" aria-live="assertive">
                {ariaLiveMessage}
              </div>`;
content = content.replace(`          {formType === "extend" && (\n            <form onSubmit={handleSubmit} className="space-y-8">`, ariaLiveDivExtend);

// 3. Update inputs with refs

// parentEvent (Select)
content = content.replace(
  `<select\n                  className="w-full flex h-12 rounded-xl border border-input`,
  `<select\n                  ref={parentEventRef}\n                  className="w-full flex h-12 rounded-xl border border-input`
);

// title
// For "new" form
content = content.replace(
  `<Input\n                  id="title"\n                  type="text"`,
  `<Input\n                  id="title"\n                  ref={titleRef}\n                  type="text"`
);
// For "extend" form (it might use the same string, wait, Input is used twice or once?)
// Let's replace all occurrences that match the exact shape.
// Wait, I will use a global replace for the id="title" Input
content = content.replace(
  /<Input\s+id="title"\s+type="text"/g,
  `<Input id="title" ref={titleRef} type="text"`
);

// categories
content = content.replace(
  `<div className="flex flex-wrap gap-2">`,
  `<div className="flex flex-wrap gap-2" ref={categoriesRef} tabIndex="-1">`
);

// location picker
content = content.replace(
  `<div>\n                <Label className="mb-3 block">Ubicación</Label>\n                <LocationPicker`,
  `<div ref={locationRef} tabIndex="-1">\n                <Label className="mb-3 block">Ubicación</Label>\n                <LocationPicker`
);

// Wait, the extend form also has a location picker conditionally.
content = content.replace(
  `<div>\n                      <Label className="mb-3 block">Nueva ubicación</Label>\n                      <LocationPicker`,
  `<div ref={locationRef} tabIndex="-1">\n                      <Label className="mb-3 block">Nueva ubicación</Label>\n                      <LocationPicker`
);

// date
content = content.replace(
  /<Input\s+id="date"\s+type="date"/g,
  `<Input id="date" ref={dateRef} type="date"`
);

// time
content = content.replace(
  /<Input\s+id="time"\s+type="time"/g,
  `<Input id="time" ref={timeRef} type="time"`
);

// Write changes back
fs.writeFileSync(path, content.replace(/\n/g, '\r\n'));
console.log("Refs added.");
