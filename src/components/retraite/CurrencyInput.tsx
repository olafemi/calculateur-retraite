/**
 * CurrencyInput — FCFA text input with real-time formatting.
 *
 * Strips non-digit characters, formats with French locale thousand separators.
 * Fixed "FCFA" suffix. Uses type="text" + inputMode="numeric" for mobile keyboard.
 * Cursor is placed at end after formatting.
 */
import { useId, useRef, useCallback } from "react";
import { FieldMessage } from "../ui/FieldMessage.tsx";
import { parseFCFAInput, formatFCFAInput } from "../../utils/validation.ts";

interface CurrencyInputProps {
  id?: string;
  label: string;
  value: number | null;
  placeholder?: string;
  helperText?: string;
  error?: string | null;
  warning?: string | null;
  onChange: (value: number | null) => void;
  onBlur?: () => void;
  autoFocus?: boolean;
}

export function CurrencyInput({
  id: externalId,
  label,
  value,
  placeholder = "Ex : 250 000",
  helperText,
  error,
  warning,
  onChange,
  onBlur,
  autoFocus,
}: CurrencyInputProps) {
  const generatedId = useId();
  const inputId = externalId ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);

  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const warningId = warning ? `${inputId}-warning` : undefined;

  const ariaDescribedBy = [helperId, errorId, warningId].filter(Boolean).join(" ") || undefined;

  const displayValue = formatFCFAInput(value);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const parsed = parseFCFAInput(raw);
      onChange(parsed);

      // Place cursor at end after React re-render
      requestAnimationFrame(() => {
        if (inputRef.current) {
          const len = inputRef.current.value.length;
          inputRef.current.setSelectionRange(len, len);
        }
      });
    },
    [onChange]
  );

  const borderClasses = error
    ? "border-2 border-error-500 focus:border-error-500 focus:ring-error-500/20"
    : warning
      ? "border border-warning-500 focus:border-primary-700 focus:ring-primary-700/20"
      : "border border-neutral-200 focus:border-primary-700 focus:ring-primary-700/20";

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-neutral-700 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          inputMode="numeric"
          value={displayValue}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-required="true"
          aria-invalid={error ? "true" : undefined}
          aria-describedby={ariaDescribedBy}
          onChange={handleChange}
          onBlur={onBlur}
          className={[
            "w-full h-11 px-3 pr-16 text-base text-neutral-900 placeholder:text-neutral-400",
            "bg-white rounded-md",
            "transition-colors duration-150",
            "focus:ring-2 focus:outline-none",
            borderClasses,
          ].join(" ")}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-400 pointer-events-none">
          FCFA
        </span>
      </div>
      {helperText && !error && !warning && (
        <FieldMessage id={helperId} type="helper" message={helperText} />
      )}
      {error && <FieldMessage id={errorId} type="error" message={error} />}
      {warning && !error && <FieldMessage id={warningId} type="warning" message={warning} />}
    </div>
  );
}
