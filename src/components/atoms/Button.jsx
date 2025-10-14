import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/20",
    secondary: "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/20",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/20",
    ghost: "text-primary hover:bg-primary/10 focus:ring-primary/20",
    danger: "bg-error text-white hover:bg-error/90 focus:ring-error/20"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm h-8",
    default: "px-4 py-2 text-sm h-10",
    lg: "px-6 py-3 text-base h-12"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;