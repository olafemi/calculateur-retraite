/**
 * TextInput — Reusable text input with label, placeholder, error/helper display.
 *
 * Visual states: default, focused, error, disabled, filled.
 * Mobile-first: text-base (16px) on inputs to prevent iOS zoom.
 */
import { useId } from "react";
import { FieldMessage } from "./FieldMessage.tsx";

interface TextInputProps {
  id?: string;
  label: string;
  value: string;
  placeholder?: string;
  error?: string | null;
  disabled?: boolean;
  maxLength?: number;
  onChange: (value: string) => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  describedBy?: string;
}

export function TextInput({
  id: externalId,
  label,
  value,
  placeholder,
  error,
  disabled = false,
  maxLength,
  onChange,
  onBlur,
  autoFocus,
  describedBy,
}: TextInputProps) {
  const generatedId = useId();
  const inputId = externalId ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  const ariaDescribedBy = [describedBy, errorId].filter(Boolean).join(" ") || undefined;

  const borderClasses = error
    ? "border-2 border-error-500 focus:border-error-500 focus:ring-error-500/20"
    : "border border-neutral-200 focus:border-primary-700 focus:ring-primary-700/20";

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-neutral-700 mb-1.5"
      >
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        autoFocus={autoFocus}
        aria-required="true"
        aria-invalid={error ? "true" : undefined}
        aria-describedby={ariaDescribedBy}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={[
          "w-full h-11 px-3 text-base text-neutral-900 placeholder:text-neutral-400",
          "bg-white rounded-md",
          "transition-colors duration-150",
          "focus:ring-2 focus:outline-none",
          "disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed",
          borderClasses,
        ].join(" ")}
      />
      {error && <FieldMessage id={errorId} type="error" message={error} />}
    </div>
  );
}
