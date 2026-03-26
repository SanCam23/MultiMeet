"use client";

export function Card({ className = "", children, ...props }) {
  return (
    <article
      className={
        "bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-border " +
        className
      }
      {...props}
    >
      {children}
    </article>
  );
}

export function CardHeader({ className = "", children, ...props }) {
  return (
    <div className={`relative ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className = "", children, ...props }) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
