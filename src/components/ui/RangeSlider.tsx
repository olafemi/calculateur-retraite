/**
 * RangeSlider — Styled HTML range input with min/max labels.
 *
 * Track: 6px tall, filled portion in primary-700, unfilled in neutral-200.
 * Thumb: 24x24px white circle with primary-700 border.
 * Uses CSS linear-gradient for the filled/unfilled split.
 */

interface RangeSliderProps {
  id: string;
  value: number;
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
  ariaValueText: string;
  onChange: (value: number) => void;
  onBlur?: () => void;
}

export function RangeSlider({
  id,
  value,
  min,
  max,
  minLabel,
  maxLabel,
  ariaValueText,
  onChange,
  onBlur,
}: RangeSliderProps) {
  const percentage = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div className="w-full">
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={ariaValueText}
        onChange={(e) => onChange(Number(e.target.value))}
        onBlur={onBlur}
        className="range-slider w-full h-1.5 rounded-full appearance-none cursor-pointer focus:outline-none"
        style={{
          background: `linear-gradient(to right, var(--color-primary-700) 0%, var(--color-primary-700) ${percentage}%, var(--color-neutral-200) ${percentage}%, var(--color-neutral-200) 100%)`,
        }}
      />
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-neutral-500 font-medium">{minLabel}</span>
        <span className="text-xs text-neutral-500 font-medium">{maxLabel}</span>
      </div>
    </div>
  );
}
