import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-card px-4 text-sm font-bold transition disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:brightness-110",
        secondary: "bg-elevated text-foreground hover:bg-surface",
        ghost: "bg-transparent text-muted hover:bg-elevated"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}
