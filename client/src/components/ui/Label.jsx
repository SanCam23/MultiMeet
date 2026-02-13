import * as React from 'react'
import { cn } from './utils'

/**
 * Label - Etiqueta accesible para formularios
 * Componente reutilizable para labels de inputs
 * 
 * @component
 * @example
 * <Label htmlFor="email">Email</Label>
 * <Input id="email" />
 */
const Label = React.forwardRef(({ className, htmlFor, ...props }, ref) => {
  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  )
})

Label.displayName = 'Label'

export { Label }
