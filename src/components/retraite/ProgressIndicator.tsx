/**
 * ProgressIndicator — Horizontal step bar with 4 step circles + connectors.
 *
 * Shows step numbers/checkmarks, connecting lines, and labels.
 * Connector between step N and N+1 is "completed" when step N is completed.
 */
import { Fragment } from "react";
import type { StepStatus, WizardStep } from "../../types/retraite.ts";
import { ProgressStep } from "./ProgressStep.tsx";

interface StepInfo {
  step: WizardStep;
  label: string;
  status: StepStatus;
}

interface ProgressIndicatorProps {
  steps: StepInfo[];
  onStepClick: (step: WizardStep) => void;
}

export function ProgressIndicator({ steps, onStepClick }: ProgressIndicatorProps) {
  return (
    <nav aria-label="Etapes du formulaire" className="mb-6">
      <ol className="flex items-center justify-between">
        {steps.map((stepInfo, index) => (
          <Fragment key={stepInfo.step}>
            <ProgressStep
              step={stepInfo.step}
              label={stepInfo.label}
              status={stepInfo.status}
              onClick={
                stepInfo.status === "completed"
                  ? () => onStepClick(stepInfo.step)
                  : undefined
              }
            />
            {/* Connector line between steps */}
            {index < steps.length - 1 && (
              <li
                aria-hidden="true"
                className="flex-1 mx-2"
              >
                <div
                  className={[
                    "h-0.5 rounded-full transition-colors duration-300",
                    stepInfo.status === "completed"
                      ? "bg-primary-700"
                      : "bg-neutral-200",
                  ].join(" ")}
                />
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
