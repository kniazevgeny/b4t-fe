"use client"

import { useState, useEffect } from "react"
import { Description, FieldError, FieldGroup, Label } from "./field"

interface DurationFieldProps {
  label?: string
  description?: string
  errorMessage?: string
  value?: { days: number; hours: number }
  onChange?: (value: { days: number; hours: number }) => void
  className?: string
}

const DurationField = ({
  label,
  description,
  errorMessage,
  value = { days: 0, hours: 0 },
  onChange,
  className,
  ...props
}: DurationFieldProps) => {
  const [days, setDays] = useState(value.days.toString())
  const [hours, setHours] = useState(value.hours.toString())

  // Update local state when value prop changes
  useEffect(() => {
    setDays(value.days.toString())
    setHours(value.hours.toString())
  }, [value.days, value.hours])

  const handleDaysChange = (newDays: string) => {
    setDays(newDays)
    const daysNum = Math.max(0, parseInt(newDays) || 0)
    onChange?.({ days: daysNum, hours: value.hours })
  }

  const handleHoursChange = (newHours: string) => {
    setHours(newHours)
    const hoursNum = Math.max(0, Math.min(23, parseInt(newHours) || 0))
    onChange?.({ days: value.days, hours: hoursNum })
  }

  return (
    <div
      className={`group flex flex-col gap-y-1 ${className || ""}`}
      {...props}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex items-center gap-1">
            <input
              aria-label="Days"
              type="number"
              min="0"
              value={days}
              onChange={(e) => handleDaysChange(e.target.value)}
              className="w-16 text-center border-0 outline-0 bg-transparent text-fg placeholder-muted-fg"
              placeholder="0"
            />
            <span className="text-muted-foreground text-sm">days</span>
          </div>
          <div className="flex items-center gap-1">
            <input
              aria-label="Hours"
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={(e) => handleHoursChange(e.target.value)}
              className="w-16 text-center border-0 outline-0 bg-transparent text-fg placeholder-muted-fg"
              placeholder="0"
            />
            <span className="text-muted-foreground text-sm">hours</span>
          </div>
        </div>
      </FieldGroup>
      {description && <Description>{description}</Description>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </div>
  )
}

export type { DurationFieldProps }
export { DurationField }
