import React from "react";

type ButtonVariant = "primary" | "accent" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "bg-primary-700 text-white",
    "hover:bg-primary-600 active:bg-primary-800",
    "focus-visible:ring-primary-700",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),

  accent: [
    "bg-accent-500 text-white",
    "hover:bg-accent-400 active:bg-accent-500",
    "shadow-sm hover:shadow",
    "focus-visible:ring-accent-500",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),

  outline: [
    "border-2 border-primary-700 text-primary-700 bg-transparent",
    "hover:bg-primary-50 active:bg-primary-100",
    "focus-visible:ring-primary-700",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),

  ghost: [
    "text-neutral-700 bg-transparent",
    "hover:bg-neutral-100 hover:text-neutral-900",
    "focus-visible:ring-primary-700",
  ].join(" "),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-8 py-3.5 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2",
        "rounded-md font-semibold transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
