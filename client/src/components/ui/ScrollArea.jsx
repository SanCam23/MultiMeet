import * as React from 'react'
import { cn } from './utils'

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn('relative overflow-auto scrollbar-hide', className)}
            {...props}
        >
            {children}
        </div>
    )
})

ScrollArea.displayName = 'ScrollArea'

export { ScrollArea }
