import { Star } from 'lucide-react'
import { useState } from 'react'

/**
 * StarRating - Componente de calificación con estrellas
 * 
 * @param {Object} props - Propiedades del componente
 * @param {number} props.value - Valor actual de la calificación (0-5)
 * @param {Function} props.onChange - Función callback cuando cambia la calificación
 * @param {boolean} props.readonly - Si es true, no permite interacción
 */
export function StarRating({ value = 0, onChange, readonly = false }) {
  const [hoverValue, setHoverValue] = useState(0)

  const handleClick = (rating) => {
    if (!readonly && onChange) {
      onChange(rating)
    }
  }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (hoverValue || value) >= star
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readonly && setHoverValue(star)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
            disabled={readonly}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-all`}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <Star
              className={`w-8 h-8 ${
                filled
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-none text-gray-300'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
