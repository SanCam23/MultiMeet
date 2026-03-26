"use client";

import { forwardRef } from "react";

const Textarea = forwardRef(function Textarea({ className = "", ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={
        "flex w-full rounded-xl border border-input bg-input-background px-4 py-3 text-sm " +
        "text-foreground placeholder:text-muted-foreground " +
        "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent " +
        "disabled:cursor-not-allowed disabled:opacity-50 " +
        "resize-y transition-colors " +
        className
      }
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
export { Textarea };
