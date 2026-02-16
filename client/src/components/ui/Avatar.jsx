import * as React from 'react'
import { cn } from './utils'

/**
 * Avatar - Componente para mostrar imagen de perfil
 * Muestra una imagen o un fallback con iniciales
 * 
 * @component
 * @example
 * <Avatar>
 *   <AvatarImage src="url" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 */

const Avatar = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
        className
      )}
      {...props}
    />
  )
})

Avatar.displayName = 'Avatar'

const AvatarImage = React.forwardRef(({ className, src, alt, ...props }, ref) => {
  const [imageError, setImageError] = React.useState(false)

  if (imageError || !src) {
    return null
  }

  return (
    <img
      ref={ref}
      src={src}
      alt={alt || 'Avatar'}
      className={cn('aspect-square h-full w-full object-cover', className)}
      onError={() => setImageError(true)}
      {...props}
    />
  )
})

AvatarImage.displayName = 'AvatarImage'

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold',
        className
      )}
      {...props}
    />
  )
})

AvatarFallback.displayName = 'AvatarFallback'

export { Avatar, AvatarImage, AvatarFallback }
