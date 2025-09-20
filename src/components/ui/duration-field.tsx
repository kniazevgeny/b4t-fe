"use client";

import { useState, useEffect } from "react";
import { Description, FieldError, FieldGroup, Label } from "./field";

interface DurationFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const DurationField = ({
  label,
  description,
  errorMessage,
  value = "",
  onChange,
  className,
  ...props
}: DurationFieldProps) => {
  const [hours, setHours] = useState(value);

  // Update local state when value prop changes
  useEffect(() => {
    setHours(value ?? "");
  }, [value]);

  const handleHoursChange = (newHours: string) => {
    setHours(newHours);
    onChange?.(newHours);
  };

  return (
    <div
      className={`group flex flex-col gap-y-1 ${className || ""}`}
      {...props}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup className="justify-end w-full">
        <div className="flex items-center gap-1 px-3 py-2">
          <input
            aria-label="Hours"
            type="number"
            min="1"
            value={hours}
            onChange={(e) => handleHoursChange(e.target.value)}
            className="w-100 text-right pr-6 border-0 outline-0 bg-transparent text-fg placeholder-muted-fg"
            placeholder="20"
          />
          <span className="text-muted-foreground text-sm">hours</span>
        </div>
      </FieldGroup>
      {description && <Description>{description}</Description>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </div>
  );
};

export type { DurationFieldProps };
export { DurationField };
