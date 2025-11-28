import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-glow)] hover:-translate-y-1",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-strong)] hover:-translate-y-1",
        outline: "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] hover:-translate-y-0.5",
        ghost: "hover:bg-accent/80 hover:text-accent-foreground hover:shadow-[var(--shadow-soft)]",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-hover",
        gradient: "text-white shadow-[var(--shadow-ai)] hover:shadow-[var(--shadow-glow)] hover:-translate-y-1 hover:scale-105 bg-[image:var(--gradient-primary)]",
        premium: "bg-[image:var(--gradient-primary)] text-white shadow-[var(--shadow-luxury)] hover:shadow-[var(--shadow-glow)] hover:-translate-y-2 hover:scale-105 border border-white/20",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-13 rounded-xl px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
