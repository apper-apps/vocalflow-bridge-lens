import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  const variants = {
    default: "glass-card p-6",
    compact: "glass-card p-4",
    minimal: "bg-surface/50 rounded-xl border border-gray-700 p-4",
    glow: "glass-card p-6 shadow-glow border-primary/20"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-200 hover:shadow-2xl",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;