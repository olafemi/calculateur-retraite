/**
 * CardOption — A single selectable card within a CardSelect group.
 *
 * Wraps a hidden radio input for accessibility.
 * Shows label, description, and a checkmark when selected.
 */

interface CardOptionProps {
  name: string;
  value: string;
  label: string;
  description: string;
  isSelected: boolean;
  hasError: boolean;
  onChange: (value: string) => void;
}

export function CardOption({
  name,
  value,
  label,
  description,
  isSelected,
  hasError,
  onChange,
}: CardOptionProps) {
  const inputId = `${name}-${value}`;

  return (
    <label
      htmlFor={inputId}
      className={[
        "relative block p-4 rounded-lg cursor-pointer select-none",
        "transition-all duration-150",
        isSelected
          ? "border-2 border-primary-700 bg-primary-50 shadow-card"
          : hasError
            ? "border border-error-500 bg-white shadow-card"
            : "border border-neutral-200 bg-white shadow-card hover:border-neutral-300 hover:shadow-card-hover hover:-translate-y-0.5",
        "focus-within:ring-2 focus-within:ring-primary-700/20 focus-within:ring-offset-2",
      ].join(" ")}
    >
      <input
        id={inputId}
        type="radio"
        name={name}
        value={value}
        checked={isSelected}
        onChange={() => onChange(value)}
        className="sr-only"
      />

      {/* Selection checkmark */}
      {isSelected && (
        <span
          className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary-700 flex items-center justify-center"
          aria-hidden="true"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M1.5 5L4 7.5L8.5 3"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}

      <span className="block text-base font-semibold text-neutral-900">
        {label}
      </span>
      <span className="block text-sm text-neutral-500 mt-0.5">
        {description}
      </span>
    </label>
  );
}
