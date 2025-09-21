import * as React from "react";
import { Textarea } from "./textarea";

export interface QuizBlockProps {
  title: string;
  helperText?: string;
  ariaLabel?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
  children?: React.ReactNode;
}

export function QuizBlock(props: QuizBlockProps) {
  const {
    title,
    helperText,
    ariaLabel,
    placeholder = "Type here...",
    value,
    onChange,
    isDisabled,
    children,
  } = props;

  return (
    <div className="border rounded-lg bg-primary/80">
      <h4 className="text-lg mx-2 my-1.5 text-white font-math">{title}</h4>
      <div className="flex flex-col gap-2 border-t border-muted p-2 rounded-lg rounded-b-md bg-input">
        {helperText ? (
          <span className="text-sm text-muted-foreground">{helperText}</span>
        ) : null}
        <Textarea
          aria-label={ariaLabel || title}
          placeholder={placeholder}
          value={value}
          onChange={(v) => onChange(String(v))}
          className={`text-primary leading-6 min-h-10 w-full`}
          autoSize
          isDisabled={isDisabled}
        />
        {children ? <div className="pt-1">{children}</div> : null}
      </div>
    </div>
  );
}


