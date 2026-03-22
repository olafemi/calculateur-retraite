/**
 * ResultsAlerts — Contextual alert banners (max 2).
 *
 * Renders 0-2 alerts with severity-based styling.
 * Error alerts use role="alert", others use role="status".
 *
 * Positioned between the greeting/user-summary and the primary card.
 * Uses mt-6 for spacing from preceding content and mb-6 for spacing
 * before the primary card (per spec section 11.2).
 */
import type { AlertDefinition, AlertSeverity } from "../../types/retraiteResults.ts";

interface ResultsAlertsProps {
  alerts: AlertDefinition[];
}

const SEVERITY_STYLES: Record<
  AlertSeverity,
  { bg: string; border: string; icon: string }
> = {
  success: {
    bg: "bg-success-100",
    border: "border-l-4 border-success-500",
    icon: "text-success-500",
  },
  info: {
    bg: "bg-primary-50",
    border: "border-l-4 border-primary-700",
    icon: "text-primary-700",
  },
  warning: {
    bg: "bg-warning-100",
    border: "border-l-4 border-warning-500",
    icon: "text-warning-500",
  },
  error: {
    bg: "bg-error-100",
    border: "border-l-4 border-error-500",
    icon: "text-error-500",
  },
};

function AlertIcon({
  severity,
  className,
}: {
  severity: AlertSeverity;
  className: string;
}) {
  switch (severity) {
    case "success":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className={className}
        >
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M6.5 10L9 12.5L13.5 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "info":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className={className}
        >
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M10 9v4M10 7v.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "warning":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className={className}
        >
          <path
            d="M10 2L19 17H1L10 2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M10 8v4M10 14v.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "error":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className={className}
        >
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M7.5 7.5L12.5 12.5M12.5 7.5L7.5 12.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

function ResultsAlert({
  severity,
  message,
}: {
  severity: AlertSeverity;
  message: string;
}) {
  const styles = SEVERITY_STYLES[severity];
  const role = severity === "error" ? "alert" : "status";

  return (
    <div
      role={role}
      className={`flex items-start gap-3 px-4 py-3 rounded-lg ${styles.bg} ${styles.border}`}
    >
      <AlertIcon
        severity={severity}
        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${styles.icon}`}
      />
      <p className="text-sm font-normal text-neutral-900">{message}</p>
    </div>
  );
}

export function ResultsAlerts({ alerts }: ResultsAlertsProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mt-6 mb-6">
      {alerts.map((alert) => (
        <ResultsAlert
          key={alert.id}
          severity={alert.severity}
          message={alert.message}
        />
      ))}
    </div>
  );
}
