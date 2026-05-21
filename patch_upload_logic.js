const fs = require('fs');
const path = "c:\\Users\\donat\\Desktop\\Ingenieria Multimedia\\Ussabilidad y Accesibilidad\\MultiMeet\\src\\app\\upload\\page.jsx";
let content = fs.readFileSync(path, 'utf8');

// Helper function to focus and announce
const focusHelper = `
  const focusAndAnnounce = (ref, message) => {
    setAriaLiveMessage(message);
    if (ref && ref.current) {
      ref.current.focus();
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      // Si no hay ref o falla, fallback a la modal
      setModalMessage(message);
      setShowModal(true);
    }
  };
`;

// Insert the helper function after setOverrideLocation
content = content.replace(
  `const [overrideLocation, setOverrideLocation] = useState(false);`,
  `const [overrideLocation, setOverrideLocation] = useState(false);\n${focusHelper}`
);

// Update handleGenerateDescription
const oldGenerate = `  const handleGenerateDescription = async () => {
    setSubmitError("");
    setSubmitSuccess("");

    const isExtend = formType === "extend";

    if (isExtend) {
      if (!parentEventId) {
        setModalMessage("Debes seleccionar el evento original para ampliar antes de generar la descripción.");
        setShowModal(true);
        return;
      }
      if (!title.trim() || !date || !time) {
        setModalMessage("Debes completar la aportación (título), la fecha y la hora de la ampliación para generar tu descripción.");
        setShowModal(true);
        return;
      }
      if (overrideLocation && !locationData.address.trim()) {
        setModalMessage("Has marcado la opción de cambiar ubicación; debes seleccionar la nueva ubicación en el mapa antes de generar la descripción.");
        setShowModal(true);
        return;
      }
    } else {
      if (!title.trim() || selectedCategories.length === 0 || !locationData.address.trim() || !date || !time) {
        setModalMessage("Debes completar el título, la ubicación, la fecha y la hora para que podamos generar tu descripción");
        setShowModal(true);
        return;
      }
    }`;

const newGenerate = `  const handleGenerateDescription = async () => {
    setSubmitError("");
    setSubmitSuccess("");
    setAriaLiveMessage("");

    const isExtend = formType === "extend";

    if (isExtend) {
      if (!parentEventId) {
        focusAndAnnounce(parentEventRef, "Error: Selecciona el evento original para ampliar antes de generar la descripción.");
        return;
      }
      if (!title.trim()) {
        focusAndAnnounce(titleRef, "Error: Debes completar la aportación (título) antes de generar la descripción.");
        return;
      }
      if (overrideLocation && !locationData.address.trim()) {
        focusAndAnnounce(locationRef, "Error: Debes seleccionar la nueva ubicación en el mapa antes de generar la descripción.");
        return;
      }
      if (!date) {
        focusAndAnnounce(dateRef, "Error: Debes seleccionar la fecha antes de generar la descripción.");
        return;
      }
      if (!time) {
        focusAndAnnounce(timeRef, "Error: Debes seleccionar la hora antes de generar la descripción.");
        return;
      }
    } else {
      if (!title.trim()) {
        focusAndAnnounce(titleRef, "Error: Debes completar el título antes de generar la descripción.");
        return;
      }
      if (selectedCategories.length === 0) {
        focusAndAnnounce(categoriesRef, "Error: Debes seleccionar al menos una categoría antes de generar la descripción.");
        return;
      }
      if (!locationData.address.trim()) {
        focusAndAnnounce(locationRef, "Error: Debes seleccionar una ubicación en el mapa antes de generar la descripción.");
        return;
      }
      if (!date) {
        focusAndAnnounce(dateRef, "Error: Debes seleccionar la fecha antes de generar la descripción.");
        return;
      }
      if (!time) {
        focusAndAnnounce(timeRef, "Error: Debes seleccionar la hora antes de generar la descripción.");
        return;
      }
    }`;

content = content.replace(oldGenerate.replace(/\n/g, '\r\n'), newGenerate.replace(/\n/g, '\r\n'));
content = content.replace(oldGenerate, newGenerate);


// Update handleSubmit
const oldSubmit = `  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitError("");
    setSubmitSuccess("");

    const isExtend = formType === "extend";

    if (isExtend && !parentEventId) {
      setSubmitError("Selecciona un evento original para ampliar.");
      return;
    }

    if (!isExtend && selectedCategories.length === 0) {
      setSubmitError("Selecciona al menos una categoría.");
      return;
    }

    if ((!isExtend || overrideLocation) && !locationData.address.trim()) {
      setSubmitError("Selecciona una ubicación.");
      return;
    }

    const dateTime = new Date(\`\${date}T\${time}\`);
    if (Number.isNaN(dateTime.getTime())) {
      setSubmitError("La fecha y hora no son válidas.");
      return;
    }

    if (dateTime.getTime() <= Date.now()) {
      setSubmitError("La fecha y hora del evento deben ser futuras.");
      return;
    }`;

const newSubmit = `  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitError("");
    setSubmitSuccess("");
    setAriaLiveMessage("");

    const isExtend = formType === "extend";

    if (isExtend) {
        if (!parentEventId) {
            focusAndAnnounce(parentEventRef, "Error: Selecciona un evento original para ampliar.");
            return;
        }
        if (!title.trim()) {
            focusAndAnnounce(titleRef, "Error: El título de la aportación es obligatorio.");
            return;
        }
        if (overrideLocation && !locationData.address.trim()) {
            focusAndAnnounce(locationRef, "Error: Debes seleccionar la nueva ubicación en el mapa.");
            return;
        }
        if (!date) {
            focusAndAnnounce(dateRef, "Error: Selecciona una fecha.");
            return;
        }
        if (!time) {
            focusAndAnnounce(timeRef, "Error: Selecciona una hora.");
            return;
        }
    } else {
        if (!title.trim()) {
            focusAndAnnounce(titleRef, "Error: El título del evento es obligatorio.");
            return;
        }
        if (selectedCategories.length === 0) {
            focusAndAnnounce(categoriesRef, "Error: Selecciona al menos una categoría.");
            return;
        }
        if (!locationData.address.trim()) {
            focusAndAnnounce(locationRef, "Error: Selecciona una ubicación en el mapa.");
            return;
        }
        if (!date) {
            focusAndAnnounce(dateRef, "Error: Selecciona una fecha.");
            return;
        }
        if (!time) {
            focusAndAnnounce(timeRef, "Error: Selecciona una hora.");
            return;
        }
    }

    const dateTime = new Date(\`\${date}T\${time}\`);
    if (Number.isNaN(dateTime.getTime())) {
      focusAndAnnounce(dateRef, "Error: La fecha y hora no son válidas.");
      return;
    }

    if (dateTime.getTime() <= Date.now()) {
      focusAndAnnounce(dateRef, "Error: La fecha y hora del evento deben ser futuras.");
      return;
    }`;

content = content.replace(oldSubmit.replace(/\n/g, '\r\n'), newSubmit.replace(/\n/g, '\r\n'));
content = content.replace(oldSubmit, newSubmit);

fs.writeFileSync(path, content.replace(/\n/g, '\r\n'));
console.log("Validation functions patched.");
