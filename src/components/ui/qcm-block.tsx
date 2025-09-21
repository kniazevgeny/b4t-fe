import * as React from "react";
import { useEffect } from "react";
import { Textarea } from "./textarea";

export interface QcmFieldDefinition {
  id: string;
  label: string;
  placeholder?: string;
}

export interface QcmOptionDefinition {
  id: string;
  label?: string;
  description: string;
  kind?: "variation" | "follow_up";
}

export interface QcmSelectionState {
  selectedId: string | null;
  fieldValues: Record<string, string>;
  otherText?: string;
}

export interface QcmBlockProps {
  title: string;
  helperText?: string;
  options: QcmOptionDefinition[];
  value?: QcmSelectionState;
  onChange?: (value: QcmSelectionState) => void;
  otherLabel?: string;
}

export function QcmBlock(props: QcmBlockProps) {
  const { title, helperText, options, value, onChange } = props;

  const [internal, setInternal] = React.useState<QcmSelectionState>({
    selectedId: null,
    fieldValues: {
      [options[0].id]: options[0].description,
    },
    otherText: "",
  });

  useEffect(() => {
    const fieldValues = options.reduce(
      (acc, opt) => {
        acc[opt.id] = opt.description;
        return acc;
      },
      {} as Record<string, string>
    );
    setInternal({
      selectedId: null,
      fieldValues,
    });
  }, [options]);

  const state = value ?? internal;
  const setState = (
    updater: (prev: QcmSelectionState) => QcmSelectionState
  ) => {
    const next = updater(state);
    if (onChange) onChange(next);
    if (!value) setInternal(next);
  };

  const handleSelect = (selectedKey: string) => {
    setState((prev) => ({ ...prev, selectedId: selectedKey }));
  };

  const handleFieldChange = (fieldId: string, text: string) => {
    setState((prev) => ({
      ...prev,
      fieldValues: { ...prev.fieldValues, [fieldId]: text },
    }));
  };

  const handleOtherChange = (text: string) => {
    setState((prev) => ({ ...prev, otherText: text }));
  };

  const onOptionKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const id = (e.currentTarget as HTMLDivElement).dataset.optionId;
      if (id) handleSelect(id);
    }
  };

  return (
    <div className="border rounded-lg bg-primary/80">
      <h4 className="text-lg mx-2 my-1.5 text-white font-math">{title}</h4>
      <div className="flex flex-col gap-3 border-t border-muted p-3 rounded-lg rounded-b-md bg-white">
        {helperText ? (
          <span className="text-sm text-muted-foreground">{helperText}</span>
        ) : null}

        <div role="radiogroup" aria-label={title} className="space-y-3">
          {options.map((opt) => {
            const isFollowUp = opt.kind === "follow_up";
            return (
              <div
                role="radio"
                aria-checked={state.selectedId === opt.id}
                aria-label={opt.description}
                tabIndex={0}
                key={opt.id}
                data-option-id={opt.id}
                onClick={() => handleSelect(opt.id)}
                onKeyDown={onOptionKeyDown}
                className="group grid grid-cols-[1.125rem_1fr] gap-x-3 gap-y-1 sm:grid-cols-[1rem_1fr]"
              >
                <span
                  aria-hidden="true"
                  className={
                    "relative inset-ring inset-ring-fg/10 isolate flex size-4.5 shrink-0 items-center justify-center rounded-full bg-input text-bg transition before:absolute before:inset-auto before:size-2 before:shrink-0 before:rounded-full before:content-[''] hover:before:bg-fg/10 sm:size-4 sm:before:size-1.7 " +
                    (state.selectedId === opt.id
                      ? "bg-primary text-primary-fg before:bg-bg hover:before:bg-muted/90 dark:inset-ring-primary"
                      : "") +
                    " group-focus-visible:inset-ring-primary group-focus-visible:ring-3 group-focus-visible:ring-ring/20"
                  }
                />
                {isFollowUp ? (
                  <div className="col-start-2 row-start-1 space-y-1">
                    <span className="text-sm">{opt?.label ?? opt?.description}</span>
                    <Textarea
                      aria-label={`${opt.description} - answer`}
                      placeholder="Your answer…"
                      key={`${opt.id}.${opt.id}`}
                      value={state.fieldValues[opt.id] ?? ""}
                      onChange={(v) => handleFieldChange(opt.id, String(v))}
                      className={
                        (state.selectedId === opt.id
                          ? ""
                          : "border-none shadow-none p-0 min-h-0")
                      }
                      onMouseDown={(e) => {
                        if (state.selectedId !== opt.id) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                ) : (
                  <Textarea
                    aria-label={opt.description}
                    key={`${opt.id}.${opt.id}`}
                    value={state.fieldValues[opt.id] ?? ""}
                    onChange={(v) => handleFieldChange(opt.id, String(v))}
                    className={
                      (state.selectedId === opt.id
                        ? ""
                        : "border-none" + "  shadow-none p-0 min-h-0") +
                      " col-start-2 row-start-1"
                    }
                    onMouseDown={(e) => {
                      if (state.selectedId !== opt.id) {
                        e.preventDefault();
                      }
                    }}
                  />
                )}
              </div>
            );
          })}

          <div
            role="radio"
            aria-checked={state.selectedId === "other"}
            aria-label={`${title} - other`}
            tabIndex={0}
            data-option-id="other"
            onClick={() => handleSelect("other")}
            onKeyDown={onOptionKeyDown}
            className="group grid grid-cols-[1.125rem_1fr] gap-x-3 gap-y-1 sm:grid-cols-[1rem_1fr]"
          >
            <span
              aria-hidden="true"
              className={
                "relative inset-ring inset-ring-fg/10 isolate flex size-4.5 shrink-0 items-center justify-center rounded-full bg-input text-bg transition before:absolute before:inset-auto before:size-2 before:shrink-0 before:rounded-full before:content-[''] hover:before:bg-fg/10 sm:size-4 sm:before:size-1.7 " +
                (state.selectedId === "other"
                  ? "bg-primary text-primary-fg before:bg-bg hover:before:bg-muted/90 dark:inset-ring-primary"
                  : "") +
                " group-focus-visible:inset-ring-primary group-focus-visible:ring-3 group-focus-visible:ring-ring/20"
              }
            />
            <Textarea
              aria-label={`${title} - other`}
              placeholder="Describe in your own words…"
              value={state.otherText ?? ""}
              onChange={(v) => handleOtherChange(String(v))}
              className="border-none shadow-none p-0 min-h-0 col-start-2 row-start-1"
              onMouseDown={(e) => {
                if (state.selectedId !== "other") {
                  e.preventDefault();
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
