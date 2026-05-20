# Informe de Auditoría de Usabilidad y Accesibilidad (WCAG 2.2)

## 1. Resumen Ejecutivo
**Nota de Cumplimiento Estimada de Usabilidad:** 85%
**Nota de Cumplimiento Estimada de Accesibilidad:** 70%

**Principales 3 fortalezas de la aplicación:**
1. **Diseño Líquido y Responsivo:** Uso intensivo de clases utilitarias (`md:`, `lg:`, `w-full`, `max-w-*`) que garantizan una correcta adaptabilidad en dispositivos móviles y de escritorio, cumpliendo con la flexibilidad y el control del usuario.
2. **Soporte Nativo para Alto Contraste:** La existencia de un modo de "Alto Contraste" definido desde variables CSS (`.high-contrast`) con soporte estricto de colores y legibilidad de texto, lo que demuestra un gran compromiso con la accesibilidad visual.
3. **Consistencia y Estándares (Etiquetado):** Los formularios utilizan correctamente componentes `<Label>` con su respectivo atributo `htmlFor` vinculado semánticamente a los `<Input>` (ej. en `EditProfileDialog.jsx` y `upload/page.jsx`), lo que favorece a los lectores de pantalla.

**Principales 3 debilidades críticas encontradas:**
1. Falta de gestión de foco y control de teclado (Focus Trap) en los modales personalizados, permitiendo que el foco escape hacia el contenido de fondo.
2. Carencia de notificaciones activas (`aria-live` o `role="alert"`) para los mensajes de error dinámicos en los formularios, lo que invisibiliza los fallos para usuarios con lectores de pantalla.
3. Uso del atributo `alt=""` (vacío) en imágenes altamente informativas, como las portadas de los eventos.

---

## 2. Tabla de Diagnóstico de Hallazgos

| ID | Categoría | Elemento / Componente | Descripción del Problema | Criterio Incumplido | Severidad |
|----|-----------|-----------------------|--------------------------|---------------------|-----------|
| 1 | Accesibilidad | Modales (`EditProfileDialog.jsx`, `FollowsDialog.jsx`) | Los diálogos no atrapan el foco del teclado (Focus Trap) en su interior y permiten la navegación por el fondo oculto. El "backdrop" de cierre usa un `div` con `onClick` sin soporte de teclado. | WCAG 2.4.3 (Focus Order), WCAG 2.1.1 (Keyboard) | CRÍTICO |
| 2 | Accesibilidad / Usabilidad | Manejo de Errores (`EditProfileDialog.jsx`) | Los mensajes de error al enviar un formulario aparecen dinámicamente pero no utilizan regiones "vivas" (ARiA live regions) para notificar inmediatamente a los lectores de pantalla. | WCAG 4.1.3 (Status Messages), WCAG 3.3.1 (Error Ident.) | MEDIO |
| 3 | Accesibilidad | Imágenes de Eventos (`src/app/item/[id]/page.jsx`) | La imagen de portada principal del evento renderiza con `alt=""`. Al ser un contenido clave e informativo, debe llevar descripción para quienes no pueden verla. | WCAG 1.1.1 (Non-text Content) | MEDIO |

---

## 3. Análisis Detallado e Instrucciones de Corrección

### Hallazgo 1: Gestión de Foco en Modales (Trampa de Teclado ausente)
- **Ubicación exacta:** `src/components/EditProfileDialog.jsx` (Línea 138), `src/components/FollowsDialog.jsx`
- **Por qué falla:** Se utiliza un `<div role="dialog">` estándar, pero no existe una lógica en JavaScript para atrapar el foco. Un usuario ciego o con movilidad reducida usando el tabulador (TAB) terminará enfocando elementos detrás de la ventana modal activa, perdiendo por completo el contexto temporal.
- **Propuesta de Código Correctivo (React):**
Lo ideal es migrar al elemento nativo `<dialog>` de HTML5, o en su defecto, implementar un bloqueo semántico y capturar el teclado usando la API `useRef`. Aquí tienes cómo asegurar el backdrop y añadir la trampa de teclado nativa con `dialog`:

```jsx
// Sustituir el <div role="dialog"> por el elemento nativo <dialog>
<dialog
  open={open}
  aria-labelledby="edit-profile-title"
  className="relative w-full sm:max-w-[525px] bg-card border border-border shadow-2xl rounded-3xl p-0 gap-0 max-h-[90vh] flex flex-col overflow-hidden m-4 backdrop:bg-background/80 backdrop:backdrop-blur-sm"
  onCancel={() => onOpenChange(false)} // Permite usar 'Esc' de forma nativa
>
  {/* Contenido del modal */}
</dialog>
```

### Hallazgo 2: Falta de Regiones Vivas (`aria-live`) para Errores
- **Ubicación exacta:** `src/components/EditProfileDialog.jsx` (Líneas 156-160)
- **Por qué falla:** Cuando el bloque `{error && <div>...</div>}` se inyecta en el DOM tras una respuesta fallida de la API, los lectores de pantalla (JAWS, NVDA, VoiceOver) no tienen manera de saber que un texto nuevo de suma importancia acaba de aparecer, dejando al usuario esperando o confundido ante un formulario que parece no responder.
- **Propuesta de Código Correctivo (React):**
Añade `role="alert"` y `aria-live="assertive"` al contenedor que envuelve el mensaje de error.

```jsx
{/* Reemplazar bloque actual por: */}
{error && (
  <div 
    role="alert" 
    aria-live="assertive" 
    className="p-3 bg-red-100/20 border border-red-500/50 text-red-500 rounded-xl text-sm text-center"
  >
    {error}
  </div>
)}
```

### Hallazgo 3: Textos Alternativos (`alt`) Vacíos en Imágenes Informativas
- **Ubicación exacta:** `src/app/item/[id]/page.jsx` (Líneas 444, 563, 1169)
- **Por qué falla:** Se carga la imagen `coverImage` del evento con `<img src={event.parentEvent.coverImage} alt="" />`. Aunque es una buena práctica dejar el alt vacío en iconos meramente decorativos, las portadas de los eventos son material visual informativo crítico que transmite el contexto y ambiente de la actividad.
- **Propuesta de Código Correctivo (React):**
Se debe incluir una breve interpolación usando el título del evento o información contextual si está disponible.

```jsx
{/* Reemplazar alt="" por texto dinámico: */}
<img 
  src={event.parentEvent.coverImage} 
  className="w-full h-full object-cover" 
  alt={`Portada del evento: ${event.parentEvent.title}`} 
/>
```
