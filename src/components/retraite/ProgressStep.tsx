/**
 * ProgressStep — Individual step circle + label in the progress indicator.
 *
 * States: active (current), completed (past, clickable), disabled (future).
 */
import type { StepStatus } from "../../types/retraite.ts";

interface ProgressStepProps {
  step: 1 | 2 | 3 | 4;
  label: string;
  status: StepStatus;
  onClick?: () => void;
}

function CheckmarkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.5 7L5.5 10L11.5 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProgressStep({ step, label, status, onClick }: ProgressStepProps) {
  const isCompleted = status === "completed";
  const isActive = status === "active";
  const isDisabled = status === "disabled";

  // Circle styles by state
  const circleClasses = isActive
    ? "bg-primary-700 text-white"
    : isCompleted
      ? "bg-primary-100 border-2 border-primary-700 text-primary-700 cursor-pointer hover:bg-primary-50"
      : "bg-neutral-100 border-2 border-neutral-200 text-neutral-400";

  // Label styles by state
  const labelClasses = isActive
    ? "text-primary-700 font-medium"
    : isCompleted
      ? "text-neutral-700 font-normal"
      : "text-neutral-400 font-normal";

  // Aria label for the step
  const ariaLabel = isActive
    ? `Etape ${step}: ${label}, en cours`
    : isCompleted
      ? `Etape ${step}: ${label}, completee`
      : `Etape ${step}: ${label}, non atteinte`;

  const Tag = isCompleted ? "button" : "span";

  return (
    <li className="flex flex-col items-center min-w-[40px]">
      <Tag
        onClick={isCompleted ? onClick : undefined}
        aria-label={ariaLabel}
        aria-current={isActive ? "step" : undefined}
        aria-disabled={isDisabled ? "true" : undefined}
        className={[
          "w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center",
          "text-sm font-semibold transition-all duration-200",
          circleClasses,
          isDisabled ? "pointer-events-none" : "",
        ].join(" ")}
        {...(isCompleted ? { type: "button" as const } : {})}
      >
        {isCompleted ? <CheckmarkIcon /> : step}
      </Tag>
      {/* Mobile: only show current step label. Desktop: show all labels. */}
      <span
        className={[
          "text-xs md:text-sm mt-1.5 text-center whitespace-nowrap",
          labelClasses,
          isActive ? "" : "hidden md:block",
        ].join(" ")}
      >
        {label}
      </span>
    </li>
  );
}
