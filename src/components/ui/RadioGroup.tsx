/**
 * RadioGroup — Inline horizontal radio button group.
 *
 * Used for the Sexe field (Homme / Femme).
 * Hidden native <input type="radio"> with custom visual circle.
 * Keyboard accessible via native radio behavior.
 */
import { FieldMessage } from "./FieldMessage.tsx";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  legend: string;
  value: string | null;
  options: RadioOption[];
  error?: string | null;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export function RadioGroup({
  name,
  legend,
  value,
  options,
  error,
  onChange,
  onBlur,
}: RadioGroupProps) {
  const errorId = error ? `${name}-error` : undefined;

  return (
    <fieldset
      aria-describedby={errorId}
    >
      <legend className="block text-sm font-medium text-neutral-700 mb-1.5">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {options.map((option) => {
          const isSelected = value === option.value;
          const inputId = `${name}-${option.value}`;

          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <input
                id={inputId}
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                onBlur={onBlur}
                className="sr-only peer"
                aria-invalid={error ? "true" : undefined}
              />
              {/* Custom radio circle */}
              <span
                aria-hidden="true"
                className={[
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                  "transition-colors duration-150",
                  isSelected
                    ? "border-primary-700"
                    : error
                      ? "border-error-500"
                      : "border-neutral-300 peer-hover:border-neutral-400",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-700/20 peer-focus-visible:ring-offset-1",
                ].join(" ")}
              >
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-700" />
                )}
              </span>
              <span className="text-base text-neutral-900">{option.label}</span>
            </label>
          );
        })}
      </div>
      {error && <FieldMessage id={errorId} type="error" message={error} />}
    </fieldset>
  );
}
