import * as React from 'react'
import { createPortal } from 'react-dom'
import { cn } from './utils'

const PopoverContext = React.createContext({
    open: false,
    setOpen: () => { },
    triggerRef: { current: null },
})

function Popover({ children }) {
    const [open, setOpen] = React.useState(false)
    const triggerRef = React.useRef(null)

    return (
        <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
            {children}
        </PopoverContext.Provider>
    )
}

function PopoverTrigger({ asChild, children, ...props }) {
    const { open, setOpen, triggerRef } = React.useContext(PopoverContext)

    const handleClick = (e) => {
        e.stopPropagation()
        setOpen((prev) => !prev)
    }

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            ref: triggerRef,
            onClick: (e) => {
                handleClick(e)
                children.props.onClick?.(e)
            },
            ...props,
        })
    }

    return (
        <button ref={triggerRef} onClick={handleClick} {...props}>
            {children}
        </button>
    )
}

function PopoverContent({
    className,
    children,
    align = 'center',
    sideOffset = 8,
    ...props
}) {
    const { open, setOpen, triggerRef } = React.useContext(PopoverContext)
    const contentRef = React.useRef(null)
    const [position, setPosition] = React.useState({ top: 0, left: 0 })
    const [isMobile, setIsMobile] = React.useState(false)

    // Detectar móvil
    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Cerrar al hacer clic fuera
    React.useEffect(() => {
        if (!open) return

        const handleClickOutside = (e) => {
            if (
                contentRef.current &&
                !contentRef.current.contains(e.target) &&
                triggerRef.current &&
                !triggerRef.current.contains(e.target)
            ) {
                setOpen(false)
            }
        }

        const handleEscape = (e) => {
            if (e.key === 'Escape') setOpen(false)
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [open, setOpen, triggerRef])

    // Calcular posición relativa al trigger
    React.useEffect(() => {
        if (!open || !triggerRef.current) return

        const updatePosition = () => {
            const rect = triggerRef.current.getBoundingClientRect()

            // En móvil: panel full-width debajo del header
            if (isMobile) {
                const headerBottom = rect.bottom + 4
                setPosition({ top: headerBottom, left: 0 })
                return
            }

            // Desktop: posición relativa al trigger
            const contentEl = contentRef.current
            let top = rect.bottom + sideOffset
            let left = rect.right

            if (contentEl) {
                const contentRect = contentEl.getBoundingClientRect()

                if (align === 'end') {
                    left = rect.right - contentRect.width
                } else if (align === 'center') {
                    left = rect.left + rect.width / 2 - contentRect.width / 2
                } else {
                    left = rect.left
                }

                if (left + contentRect.width > window.innerWidth - 8) {
                    left = window.innerWidth - contentRect.width - 8
                }
                if (left < 8) left = 8
            }

            setPosition({ top, left })
        }

        updatePosition()
        window.addEventListener('resize', updatePosition)
        window.addEventListener('scroll', updatePosition, true)
        return () => {
            window.removeEventListener('resize', updatePosition)
            window.removeEventListener('scroll', updatePosition, true)
        }
    }, [open, align, sideOffset, triggerRef, isMobile])

    if (!open) return null

    const mobileStyles = isMobile
        ? { top: position.top, left: 8, right: 8, width: 'auto' }
        : { top: position.top, left: position.left }

    return createPortal(
        <>
            {/* Overlay semi-transparente en móvil */}
            {isMobile && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 animate-fade-in"
                    onClick={() => setOpen(false)}
                />
            )}
            <div
                ref={contentRef}
                className={cn(
                    'fixed z-50 bg-popover text-popover-foreground border shadow-md outline-none animate-fade-in',
                    isMobile ? 'rounded-2xl shadow-2xl' : 'rounded-md',
                    className
                )}
                style={mobileStyles}
                {...props}
            >
                {children}
            </div>
        </>,
        document.body
    )
}

export { Popover, PopoverTrigger, PopoverContent }
