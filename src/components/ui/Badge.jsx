"use client";

export function Badge({ className = "", variant = "default", children, ...props }) {
  const variants = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-input bg-transparent text-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground",
  };

  return (
    <span
      className={
        "inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full transition-colors " +
        (variants[variant] || variants.default) +
        " " +
        className
      }
      {...props}
    >
      {children}
    </span>
  );
}
