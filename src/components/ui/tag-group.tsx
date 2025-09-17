import { IconX } from "@intentui/icons";
import type {
  TagGroupProps as TagGroupPrimitiveProps,
  TagListProps,
  TagProps as TagPrimitiveProps,
} from "react-aria-components";
import {
  Button,
  composeRenderProps,
  TagGroup as TagGroupPrimitive,
  TagList as TagListPrimitive,
  Tag as TagPrimitive,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { composeTailwindRenderProps } from "@/lib/primitive";
import { Description, Label } from "./field";

interface TagGroupProps extends TagGroupPrimitiveProps {
  errorMessage?: string;
  label?: string;
  description?: string;
  ref?: React.RefObject<HTMLDivElement>;
}

const TagGroup = ({ children, ref, className, ...props }: TagGroupProps) => {
  return (
    <TagGroupPrimitive
      ref={ref}
      className={twMerge("flex flex-col flex-wrap", className)}
      {...props}
    >
      {props.label && <Label className="mb-1">{props.label}</Label>}
      {children}
      {props.description && <Description>{props.description}</Description>}
    </TagGroupPrimitive>
  );
};

const TagList = <T extends object>({
  className,
  ...props
}: TagListProps<T>) => {
  return (
    <TagListPrimitive
      {...props}
      className={composeTailwindRenderProps(className, "flex flex-wrap gap-1")}
    />
  );
};

interface TagProps extends TagPrimitiveProps {}

const Tag = ({ className, children, ...props }: TagProps) => {
  const textValue = typeof children === "string" ? children : undefined;
  return (
    <TagPrimitive
      textValue={textValue}
      {...props}
      className={composeRenderProps(
        className,
        (
          className,
          { isFocusVisible, isSelected, isDisabled, allowsRemoving }
        ) =>
          twMerge(
            "flex justify-center items-center gap-1 py-1 px-3 h-8 min-w-8 rounded text-sm font-bold leading-[1.375rem] cursor-default outline-hidden",
            // Default state
            "bg-neutral-100 text-black",
            // Selected/Active state
            isSelected && "bg-accent text-white",
            // Focus state
            isFocusVisible && "ring-2 ring-accent ring-offset-2",
            // Disabled state
            isDisabled && "opacity-50",
            // Remove button spacing
            allowsRemoving && "pr-2",
            className
          )
      )}
    >
      {({ allowsRemoving }) => (
        <>
          {children}
          {allowsRemoving && (
            <Button
              slot="remove"
              className="-mx-0.5 grid size-3.5 shrink-0 place-content-center rounded-full text-muted-fg outline-hidden hover:text-fg"
            >
              <IconX data-slot="close" className="size-3" />
            </Button>
          )}
        </>
      )}
    </TagPrimitive>
  );
};

export type { TagGroupProps, TagProps, TagListProps };
export { Tag, TagList, TagGroup };
