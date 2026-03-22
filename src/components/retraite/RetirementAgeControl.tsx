/**
 * RetirementAgeControl — Slider + numeric input composite for retirement age.
 *
 * Large centered value display + range slider + small manual input.
 * Both slider and input are synced to the same value.
 */
import { RangeSlider } from "../ui/RangeSlider.tsx";
import { NumberInput } from "../ui/NumberInput.tsx";
import { FieldMessage } from "../ui/FieldMessage.tsx";

interface RetirementAgeControlProps {
  value: number;
  min: number;
  max: number;
  error?: string | null;
  onChange: (value: number) => void;
  onBlur?: () => void;
}

export function RetirementAgeControl({
  value,
  min,
  max,
  error,
  onChange,
  onBlur,
}: RetirementAgeControlProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Large centered value display */}
      <div className="text-center mb-4">
        <span className="block text-2xl md:text-3xl font-bold text-primary-700">
          {value}
        </span>
        <span className="block text-base font-normal text-neutral-500">
          ans
        </span>
      </div>

      {/* Range slider */}
      <div className="w-full mb-2">
        <RangeSlider
          id="age-retraite-slider"
          value={value}
          min={min}
          max={max}
          minLabel={`${min} ans`}
          maxLabel={`${max} ans`}
          ariaValueText={`${value} ans`}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>

      {/* Small numeric input for manual fine-tuning */}
      <div className="mt-2">
        <NumberInput
          id="age-retraite-input"
          value={value}
          min={min}
          max={max}
          suffix="ans"
          onChange={onChange}
          onBlur={onBlur}
          ariaLabel="Age de depart a la retraite"
        />
      </div>

      {/* Error display */}
      {error && (
        <div className="w-full mt-2">
          <FieldMessage type="error" message={error} />
        </div>
      )}
    </div>
  );
}
