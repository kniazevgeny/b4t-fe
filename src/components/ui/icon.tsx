"use client";

import { tv, type VariantProps } from "tailwind-variants";

const iconStyles = tv({
  base: "flex items-center justify-center",
  variants: {
    size: {
      sm: "w-4 h-4",
      md: "w-6 h-6", 
      lg: "w-8 h-8",
      xl: "w-12 h-12",
    },
    variant: {
      request: "rounded-lg bg-blue-500/20 text-blue-500",
      comment: "rounded-lg bg-green-500/20 text-green-500", 
      circle: "rounded-lg bg-purple-500/20 text-purple-500",
      idea: "rounded-lg bg-orange-500/20 text-orange-500",
    }
  },
  defaultVariants: {
    size: "md",
    variant: "circle"
  }
});

interface IconProps extends VariantProps<typeof iconStyles> {
  className?: string;
}

const Icon = ({ variant, size, className }: IconProps) => {
  const renderIcon = () => {
    switch (variant) {
      case "request":
        return (
          <div className="w-4 h-4 rounded bg-white/30 flex items-center justify-center">
            <div className="w-2 h-2 rounded bg-white/50"></div>
          </div>
        );
      case "comment":
        return (
          <div className="w-4 h-4 rounded bg-white/30 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
          </div>
        );
      case "circle":
        return (
          <div className="w-4 h-4 rounded bg-white/30 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
          </div>
        );
      case "idea":
        return (
          <div className="w-4 h-4 rounded bg-white/30 flex items-center justify-center">
            <div className="w-2 h-2 rounded bg-white/50"></div>
          </div>
        );
      default:
        return (
          <div className="w-4 h-4 rounded bg-white/30 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
          </div>
        );
    }
  };

  return (
    <div className={iconStyles({ variant, size, className })}>
      {renderIcon()}
    </div>
  );
};

export type { IconProps };
export { Icon, iconStyles };
