import { composeRenderProps } from "react-aria-components"
import { twMerge, type ClassNameValue } from "tailwind-merge"
import { tv } from "tailwind-variants"

function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tailwind: ClassNameValue,
): string | ((v: T) => string) {
  return composeRenderProps(className, (className) => twMerge(tailwind, className))
}

const focusRing = tv({
  variants: {
    isFocused: { true: "outline-hidden border-2 border-primary data-invalid:border-danger/20" },
    isFocusVisible: { true: "outline-hidden border-2 border-ring/20" },
    isInvalid: { true: "border-2 border-danger/20" },
  },
})

const focusStyles = tv({
  extend: focusRing,
  variants: {
    isFocused: { true: "border-ring/70 forced-colors:border-primary" },
    isInvalid: { true: "border-danger/70 forced-colors:border-[Mark]" },
  },
})

const focusButtonStyles = tv({
  base: "outline outline-ring outline-offset-2 forced-colors:outline-brand",
  variants: {
    isFocusVisible: {
      false: "outline-0",
      true: "outline-2",
    },
  },
})

export { composeTailwindRenderProps, focusRing, focusStyles, focusButtonStyles }
