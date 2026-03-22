/**
 * SelectInput — Styled native <select> with label, placeholder, error state.
 *
 * Uses native select for mobile UX (OS picker wheel).
 * Custom chevron indicator via appearance-none + positioned SVG.
 */
import { useId } from "react";
import { FieldMessage } from "./FieldMessage.tsx";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectInputProps {
  id?: string;
  label?: string;
  value: string | number | null;
  placeholder: string;
  options: SelectOption[];
  error?: string | null;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
  describedBy?: string;
}

export function SelectInput({
  id: externalId,
  label,
  value,
  placeholder,
  options,
  error,
  disabled = false,
  onChange,
  onBlur,
  describedBy,
}: SelectInputProps) {
  const generatedId = useId();
  const selectId = externalId ?? generatedId;

  // Only generate an errorId if the error is a real message (not whitespace-only).
  // This prevents broken aria-describedby references when a parent component
  // passes a whitespace error solely to trigger the red border styling.
  const hasRealError = error != null && error.trim().length > 0;
  const errorId = hasRealError ? `${selectId}-error` : undefined;

  const ariaDescribedBy = [describedBy, errorId].filter(Boolean).join(" ") || undefined;

  const hasValue = value !== null && value !== "";

  const borderClasses = error
    ? "border-2 border-error-500 focus:border-error-500 focus:ring-error-500/20"
    : "border border-neutral-200 focus:border-primary-700 focus:ring-primary-700/20";

  return (
    <div>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value ?? ""}
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={ariaDescribedBy}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={[
            "w-full h-11 px-3 pr-8 text-base bg-white rounded-md",
            "appearance-none cursor-pointer",
            "transition-colors duration-150",
            "focus:ring-2 focus:outline-none",
            "disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed",
            hasValue ? "text-neutral-900" : "text-neutral-400",
            borderClasses,
          ].join(" ")}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom chevron */}
        <svg
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {error && <FieldMessage id={errorId} type="error" message={error} />}
    </div>
  );
}
