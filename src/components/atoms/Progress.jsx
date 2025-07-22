import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Progress = forwardRef(({ className, value = 0, max = 100, variant = "primary", ...props }, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary",
    accent: "bg-gradient-to-r from-accent to-orange-500",
    success: "bg-gradient-to-r from-green-500 to-emerald-500"
  };

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      ref={ref}
      className={cn("w-full bg-gray-700 rounded-full h-2 overflow-hidden", className)}
      {...props}
    >
      <div
        className={cn(
          "h-full transition-all duration-500 ease-out rounded-full",
          variants[variant]
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
});

Progress.displayName = "Progress";

export default Progress;