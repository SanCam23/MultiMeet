"use client";

export function Label({ className = "", htmlFor, children, ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={
        "text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 " +
        className
      }
      {...props}
    >
      {children}
    </label>
  );
}
