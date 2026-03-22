/**
 * FieldMessage — Reusable message display below form fields.
 *
 * Variants:
 * - helper: neutral gray helper text
 * - error: red error message with role="alert"
 * - warning: amber warning with subtle background and role="status"
 */

interface FieldMessageProps {
  id?: string;
  type: "helper" | "error" | "warning";
  message: string;
}

export function FieldMessage({ id, type, message }: FieldMessageProps) {
  if (!message || !message.trim()) return null;

  const baseClasses = "flex items-start gap-1.5 mt-1";

  if (type === "helper") {
    return (
      <p id={id} className={`${baseClasses} text-xs md:text-sm text-neutral-500`}>
        {message}
      </p>
    );
  }

  if (type === "error") {
    return (
      <p
        id={id}
        role="alert"
        className={`${baseClasses} text-xs md:text-sm font-medium text-error-500`}
      >
        <svg
          className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {message}
      </p>
    );
  }

  // warning
  return (
    <div
      id={id}
      role="status"
      className={`${baseClasses} text-xs md:text-sm font-medium text-warning-500 bg-warning-100 border border-warning-500/20 rounded px-3 py-2`}
    >
      <svg
        className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M7 1L13 12H1L7 1z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M7 5v3M7 10v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span>{message}</span>
    </div>
  );
}
