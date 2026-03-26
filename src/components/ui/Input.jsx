"use client";

import { forwardRef } from "react";

const Input = forwardRef(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={
        "flex h-10 w-full rounded-xl border border-input bg-input-background px-4 py-2 text-sm " +
        "text-foreground placeholder:text-muted-foreground " +
        "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent " +
        "disabled:cursor-not-allowed disabled:opacity-50 " +
        "transition-colors " +
        className
      }
      {...props}
    />
  );
});

Input.displayName = "Input";
export { Input };
