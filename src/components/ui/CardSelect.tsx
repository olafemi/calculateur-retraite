/**
 * CardSelect — A group of selectable cards (radio group semantics).
 *
 * Used for Step 2 (Statut professionnel).
 * Mobile: vertical stack. Desktop: 2x2 grid.
 */
import { CardOption } from "./CardOption.tsx";
import { FieldMessage } from "./FieldMessage.tsx";

interface CardSelectOption {
  value: string;
  label: string;
  description: string;
}

interface CardSelectProps {
  name: string;
  legend: string;
  value: string | null;
  options: CardSelectOption[];
  error?: string | null;
  onChange: (value: string) => void;
}

export function CardSelect({
  name,
  legend,
  value,
  options,
  error,
  onChange,
}: CardSelectProps) {
  const errorId = error ? `${name}-error` : undefined;

  return (
    <fieldset aria-required="true" aria-describedby={errorId}>
      <legend className="sr-only">{legend}</legend>
      <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-3">
        {options.map((option) => (
          <CardOption
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            description={option.description}
            isSelected={value === option.value}
            hasError={!!error && value === null}
            onChange={onChange}
          />
        ))}
      </div>
      {error && <FieldMessage id={errorId} type="error" message={error} />}
    </fieldset>
  );
}
