"use client";

import { forwardRef } from "react";

const Button = forwardRef(function Button(
  { className = "", variant = "default", size = "default", children, ...props },
  ref
) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors cursor-pointer " +
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 " +
    "disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    outline: "border border-input bg-card text-foreground hover:bg-muted/50",
    ghost: "text-foreground hover:bg-muted/50",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-5 py-2 text-sm rounded-xl",
    sm: "h-9 px-3 text-xs rounded-lg",
    lg: "h-12 px-8 text-base rounded-xl",
    icon: "h-10 w-10 rounded-xl",
  };

  const classes = `${baseClasses} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`;

  return (
    <button ref={ref} className={classes} {...props}>
      {children}
    </button>
  );
});

Button.displayName = "Button";
export { Button };
