"use client";

import { forwardRef } from "react";
import { Calendar, Clock } from "lucide-react";

const Input = forwardRef(function Input({ className = "", type, ...props }, ref) {
  const isDate = type === "date";
  const isTime = type === "time";

  const inputEl = (
    <input
      ref={ref}
      type={type}
      className={
        "flex h-10 w-full rounded-xl border border-input bg-input-background px-4 py-2 text-sm " +
        "text-foreground placeholder:text-muted-foreground " +
        "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent " +
        "disabled:cursor-not-allowed disabled:opacity-50 " +
        "transition-colors " +
        (isDate || isTime ? "pr-10 " : "") +
        className
      }
      {...props}
    />
  );

  if (isDate || isTime) {
    return (
      <div className="relative w-full flex items-center">
        {inputEl}
        <div className="absolute right-3.5 pointer-events-none text-muted-foreground/60 dark:text-muted-foreground/80 flex items-center justify-center">
          {isDate ? (
            <Calendar className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Clock className="w-4 h-4" aria-hidden="true" />
          )}
        </div>
      </div>
    );
  }

  return inputEl;
});

Input.displayName = "Input";
export { Input };
