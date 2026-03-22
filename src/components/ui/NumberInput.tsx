/**
 * NumberInput — Small numeric input with optional suffix.
 *
 * Used for the retirement age control (synced with RangeSlider).
 * Uses type="text" + inputMode="numeric" for full control without native spinner.
 */

interface NumberInputProps {
  id: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  onChange: (value: number) => void;
  onBlur?: () => void;
  ariaLabel?: string;
}

export function NumberInput({
  id,
  value,
  min,
  max,
  suffix,
  onChange,
  onBlur,
  ariaLabel,
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw === "") return;
    const num = parseInt(raw, 10);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  const handleBlur = () => {
    // Clamp to valid range on blur
    if (value < min) onChange(min);
    if (value > max) onChange(max);
    onBlur?.();
  };

  return (
    <div className="relative inline-flex items-center">
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={value.toString()}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-label={ariaLabel}
        className={[
          "w-20 h-11 text-center text-base text-neutral-900",
          "bg-white border border-neutral-200 rounded-md",
          "transition-colors duration-150",
          "focus:border-primary-700 focus:ring-2 focus:ring-primary-700/20 focus:outline-none",
          suffix ? "pr-10" : "",
        ].join(" ")}
      />
      {suffix && (
        <span className="absolute right-3 text-sm font-medium text-neutral-400 pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
}
