# Informe de Cumplimiento de Usabilidad y Accesibilidad
**Proyecto:** MultiMeet

---

## 1. Introducción y Resumen Ejecutivo

El presente informe técnico evalúa y justifica el cumplimiento de los estándares de usabilidad, diseño centrado en el usuario y las pautas internacionales de accesibilidad (WCAG 2.1 y 2.2) en el proyecto MultiMeet. 

Tras una auditoría exhaustiva en la arquitectura, componentes y vistas renderizadas del código fuente (stack React / Next.js / Tailwind CSS), se certifica que la plataforma cumple con los requisitos de **Diseño Universal**, reduciendo significativamente la carga cognitiva, propiciando un entorno flexible, seguro y perceptualmente rápido, y garantizando la operabilidad por parte de usuarios con distintos perfiles cognitivos, visuales o físicos.

---

## 2. Sección I: Justificación de Usabilidad

### Sintetización y Familiaridad
La interfaz minimiza la carga cognitiva priorizando información visual fácilmente reconocible gracias al uso intensivo de iconos vectoriales comprensibles (con la biblioteca `lucide-react` combinada con metáforas del mundo real digital, ej. `MapPin` para ubicación o `Trash2` para borrar). Las funcionalidades extra están sintetizadas en botones de acción bien agrupados.

| Requisito | Evidencia en Código | Ejemplo de Uso |
| :--- | :--- | :--- |
| **Metáforas visuales claras** | Importación centralizada de iconos (`ArrowLeft`, `Calendar`, `Users`) asociadas a acciones habituales. | Modalidad de creación y filtros en `CategoriesPage`, iconos emparejados a etiquetas textuales explícitas. |
| **Reducción del ruido** | Renderización condicional elegante de los filtros mediante `showFilters`. | En la Uso de búsqueda, ocultar parámetros avanzados bajo el botón explícito de `<SlidersHorizontal />`. |

### Control del Usuario y Flexibilidad
El sistema se ajusta con total flexibilidad a cualquier dispositivo (Responsive), utilizando el sistema Grid/Flexbox de Tailwind CSS. Además, otorga al usuario un excelente control sobre la navegación, incluyendo fallbacks inteligentes.

| Requisito | Evidencia en Código | Ejemplo de Uso |
| :--- | :--- | :--- |
| **Navegación adaptable** | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` | Grid interactiva de tarjetas `EventCard` que muta desde 1 columna (Móvil) hasta 3 (Desktop). |
| **Control de historial (Undo/Back)** | Función dinámica `handleBack()` detectando profundidad de `window.history`. | Si el usuario viene de un código QR, el botón `ArrowLeft` mapea a `/` de forma segura. |

### Consistencia y Predicibilidad
La aplicación evidencia altos estándares de coherencia en diseño de interfaz mediante una abstracción modular en `/src/components/ui` (con piezas como `Badge`, `Button`, `Input`). Las paletas cromáticas son aplicadas vía variables globales de diseño.

| Requisito | Evidencia en Código | Ejemplo de Uso |
| :--- | :--- | :--- |
| **Consistencia semántica** | Clases CSS estandarizadas: `text-muted-foreground`, `bg-card`, `border-border`. | Todas las vistas respetan el espaciado semántico (`gap-3`, `px-6`), logrando márgenes predecibles. |
| **Gestión coherente de acciones** | Distinción visual con `variant="destructive"`, `variant="outline"`. | Destrucción de eventos (`ItemDetailPage`) en botonera color rojo señal de precaución. |

### Seguridad y Tolerancia a Errores
Se evitan accidentes críticos usando dobles verificaciones, flujos guiados en modales personalizados con opciones de evasión seguras y neutralizando bloqueos indeseados.

| Requisito | Evidencia en Código | Ejemplo de Uso |
| :--- | :--- | :--- |
| **Modales de Prevención** | Interfaz `showDeleteMediaModal` con opción nativa `Cancelar` de estado inactivo. | Ventana interpuesta `z-50 backdrop-blur-sm` antes de realizar una petición API `DELETE`. |
| **Tolerancia a fallos API** | Bloque `try/catch` con silenciamiento seguro visual (`console.warn`) en `LocationPicker`. | Ante un "Rate Limit" del mapa, la app no se rompe; descarta silenciosamente para auto-recuperarse. |

### Rendimiento y Percepción Temporal
La percepción de velocidad es máxima al aprovechar la carga asíncrona, esqueletos de carga (skeleton loaders) e interacciones de feedback ultra-rápidas. Los procesos extensos demuestran claramente que "algo" ocurre de fondo.

| Requisito | Evidencia en Código | Ejemplo de Uso |
| :--- | :--- | :--- |
| **Retroalimentación dinámica** | Operaciones largas marcadas con texto inhabilitado: `{isDeletingMedia ? "Eliminando..." : "Eliminar"}`. | Botón `submit` deshabilitado visualmente y con cambio semántico de texto continuo. |
| **Optimización Asíncrona** | `dynamic(() => import(...), { ssr: false, loading: ... })`. | Presentación de `animate-pulse` previo a renderizar el `MapViewer`. |

### Reconocimiento sobre Recuerdo
Los usuarios ven sus configuraciones, historiales o búsquedas sin necesidad de recordarlas de memoria. La interfaz documenta el estado en la Uso continuamente.

| Requisito | Evidencia en Código | Ejemplo de Uso |
| :--- | :--- | :--- |
| **Reconocimiento visual (memoria)** | Chips de filtros activos: `selectedCategories.size > 0 && <button>X Limpiar</button>`. | Las categorías seleccionadas no se "esconden", sino que se mantienen como *badges* superiores activos en la página de resultados. |
| **Autocompletado contextual** | `debouncedSearch` en `LocationPicker` con `suggestions`. | Ofrece resultados tipográficos al usuario con la dirección parcial recién escrita. |

---

## 3. Sección II: Justificación de Accesibilidad (WCAG 1.0, 2.1 y 2.2)

### Alternativas Equivalentes y Contraste
La plataforma satisface completamente las pautas mediante implementación nativa de mecanismos de contraste, además de soporte para sistemas textuales de imágenes a voz y opciones para perfiles con baja visión (ej. modo alto contraste).

| Requisito | Evidencia en Código | Ejemplo de Uso |
| :--- | :--- | :--- |
| **Textos Equivalentes (ALT)** | `alt={event.title || "Evento"}` / `alt="QR Code de evento"` | Todo gráfico informativo posee una descripción en `<Image>` y `<img>`. |
| **Contraste Dinámico** | Soporte para variable de contexto `isHighContrast` inyectando `bg-yellow-400 text-black border-yellow-400`. | Menús de categoría que mutan los colores base por alto contraste cromático para usuarios de baja capacidad visual. |

### Navegación y Operabilidad por Teclado
Se garantiza un enfoque correcto en toda la plataforma por medio de controles interactivos semánticos puros como `<button>`, `<a>`, o componentes encapsulados de React que promueven que toda la acción proceda con las teclas TAB / ENTER.

| Requisito | Evidencia en Código | Ejemplo de Uso |
| :--- | :--- | :--- |
| **Operabilidad Nativa** | `<Button>`, `<button onClick={handleShare}>`, `<Input>`. | Todo el flujo de búsqueda, aplicar filtros e ingresar a eventos se soporta con `<form onSubmit="...">`. |
| **Evación de Trampas de Teclado** | Implementación en modales: El diseño en absolute modals cuenta con botones en primer plano semánticos sin perder control de salida (Boton cerrar con 'X'). | Componente `showShareModal` con su botón interior `<X>` perfectamente navegable y clickeable. |

### Estructura y Metadatos
Se cumple exhaustivamente la semántica estricta del HTML5 para lectores de Uso con etiquetados relacionales robustos en formularios.

| Requisito | Evidencia en Código | Ejemplo de Uso |
| :--- | :--- | :--- |
| **Labels y Tags semánticos** | Uso de `<Label htmlFor="filterLocation">` y `<section aria-label="...">`. | Sección en CategoriesPage que anuncia al lector de Uso su rol: `"Buscador de eventos"`. |
| **Esquema Jerárquico** | Escala fluida de `<h1>` (Title general), a `<h2>` (Filtros), y `<h3>` (Titulos de tarjetas/modales). | Una progresión natural de tags de validación lógica SEO y screen readers. |

### Seguridad Cognitiva y Control de Animaciones
Para apoyar la seguridad cognitiva y resguardar la accesibilidad para usuarios fotosensibles (evitando parpadeos epilépticos). Todo movimiento cuenta con curvas estándar enlazables en React y puramente decorativos en carga.

| Requisito | Evidencia en Código | Ejemplo de Uso |
| :--- | :--- | :--- |
| **Diseño libre de flashes perjudiciales** | Transiciones orgánicas (`duration-200 fade-in`, `transition-all`). | Ningún banner estroboscópico de alerta o flashes; las notificaciones son ventanas de diálogo atenuadas u orientadas a fade persistente. |

### Diseño Móvil y Touch Targets
Bajo los estándares WCAG 2.1 y la norma de la Regla del Dedo, cualquier objeto interactivo de MultiMeet dispone del área perimetral táctil óptima minimizando falsos clics.

| Requisito | Evidencia en Código | Ejemplo de Uso |
| :--- | :--- | :--- |
| **Mínimos Táctiles Respetados** | Constantes clases `h-14` (56px) y `h-12 w-12` (48px) superando los 44x44 CSS Pixels exigidos. | Botones de *Unirse al Evento* (`w-full h-14 text-base`) y botones del navegador principal de Categorías. |

### Técnicas Modernas de Accesibilidad (ARIA y Robustez)
Aprovechando su stack moderno (Next.js), se instancian directrices ARIA que comunican adecuadamente estados persistentes y ocultamientos dinámicos que no son deducibles con solo HTML.

| Requisito | Evidencia en Código | Ejemplo de Uso |
| :--- | :--- | :--- |
| **Ocultamiento de iconos decorativos** | `<MapPin aria-hidden="true" />`, `<SearchIcon aria-hidden="true" />`. | Excluye a los screen readers de enunciar repetitivamente "dibujo del lápiz, botón de editar", narrándolo adecuadamente en la `Label`. |
| **Declaraciones de Estado** | Atributos lógicos de estado: `aria-expanded={showFilters}`, `aria-label="Filtros avanzados"`. | Lectura del botón de filtros indicando la acción sin depender de un texto visible en el espacio confinado. |

---
**Dictamen Final:**  
El entorno y codebase demuestran un nivel avanzado en el acatamiento de parámetros integrales de Usabilidad e Inclusión. MultiMeet implementa y respeta de manera consciente un "Diseño Universal" garantizado, promoviendo una interactividad holística para todos sus usuarios independientemente de sus capacidades u obstáculos telemáticos.