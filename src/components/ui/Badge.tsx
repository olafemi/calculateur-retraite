import type { ToolStatus } from "../../types/tool";

interface BadgeProps {
  status: ToolStatus;
}

const statusConfig: Record<
  ToolStatus,
  { label: string; classes: string; dotColor: string }
> = {
  available: {
    label: "Disponible",
    classes: "bg-success-100 text-success-500",
    dotColor: "bg-success-500",
  },
  coming_soon: {
    label: "Bientôt",
    classes: "bg-warning-100 text-warning-500",
    dotColor: "bg-warning-500",
  },
  locked: {
    label: "Verrouillé",
    classes: "bg-neutral-100 text-neutral-500",
    dotColor: "bg-neutral-500",
  },
};

export function Badge({ status }: BadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5",
        "rounded-full px-2.5 py-0.5",
        "text-xs font-semibold",
        config.classes,
      ].join(" ")}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dotColor}`}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}
