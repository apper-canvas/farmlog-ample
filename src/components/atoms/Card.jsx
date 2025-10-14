import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  children,
  hover = true,
  ...props 
}, ref) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-secondary/20 shadow-sm transition-all duration-200",
        hover && "hover:shadow-md hover:scale-[1.01]",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;