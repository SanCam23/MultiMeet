import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from './utils'

/**
 * Sheet - Modal/Drawer desde abajo (mobile-first)
 * Componente para mostrar contenido overlay desde diferentes lados de la pantalla
 * 
 * @component
 * @example
 * <Sheet>
 *   <SheetTrigger asChild>
 *     <Button>Open</Button>
 *   </SheetTrigger>
 *   <SheetContent>
 *     <SheetHeader>
 *       <SheetTitle>Title</SheetTitle>
 *     </SheetHeader>
 *   </SheetContent>
 * </Sheet>
 */

const SheetContext = React.createContext({
  open: false,
  setOpen: () => { },
})

const Sheet = ({ children, open: controlledOpen, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = React.useState(false)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  )
}

const SheetTrigger = React.forwardRef(({ asChild, children, ...props }, ref) => {
  const { setOpen } = React.useContext(SheetContext)

  const handleClick = () => setOpen(true)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: (e) => {
        handleClick()
        children.props.onClick?.(e)
      },
      ref,
    })
  }

  return (
    <button ref={ref} onClick={handleClick} {...props}>
      {children}
    </button>
  )
})

SheetTrigger.displayName = 'SheetTrigger'

const SheetContent = React.forwardRef(({
  side = 'bottom',
  className,
  children,
  ...props
}, ref) => {
  const { open, setOpen } = React.useContext(SheetContext)

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  const sideClasses = {
    bottom: 'bottom-0 left-0 right-0 animate-slide-up',
    top: 'top-0 left-0 right-0 animate-slide-down',
    left: 'left-0 top-0 bottom-0 animate-slide-right',
    right: 'right-0 top-0 bottom-0 animate-slide-left',
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={() => setOpen(false)}
      />

      {/* Sheet Content */}
      <div
        ref={ref}
        className={cn(
          'fixed z-50 bg-card shadow-xl',
          sideClasses[side],
          className
        )}
        {...props}
      >
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {children}
      </div>
    </>
  )
})

SheetContent.displayName = 'SheetContent'

const SheetHeader = ({ className, ...props }) => (
  <div
    className={cn('flex flex-col space-y-2 text-left', className)}
    {...props}
  />
)

SheetHeader.displayName = 'SheetHeader'

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('text-lg font-semibold text-foreground', className)}
    {...props}
  />
))

SheetTitle.displayName = 'SheetTitle'

const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))

SheetDescription.displayName = 'SheetDescription'

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
}
