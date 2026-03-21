import { Link } from "react-router";
import type { Tool } from "../../types/tool";
import { Badge } from "../ui/Badge";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const isAvailable = tool.status === "available";

  const cardContent = (
    <>
      {/* Icon square */}
      <div
        className={[
          "w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl flex-shrink-0",
          isAvailable
            ? "bg-primary-100 group-hover:bg-primary-100/80"
            : "bg-neutral-100",
        ].join(" ")}
        aria-hidden="true"
      >
        {tool.icon}
      </div>

      {/* Tool name */}
      <h3
        className={[
          "text-lg font-bold mb-1",
          isAvailable ? "text-neutral-900" : "text-neutral-500",
        ].join(" ")}
      >
        {tool.name}
      </h3>

      {/* Description */}
      <p
        className={[
          "text-sm leading-relaxed mb-4",
          isAvailable ? "text-neutral-500" : "text-neutral-400",
        ].join(" ")}
      >
        {tool.description}
      </p>

      {/* Badge — pushed to bottom */}
      <div className="mt-auto">
        <Badge status={tool.status} />
      </div>
    </>
  );

  const baseCardClasses = [
    "group flex flex-col bg-white rounded-lg p-6",
    "border border-neutral-200 shadow-card",
    "transition-all duration-150",
  ].join(" ");

  if (isAvailable) {
    return (
      <Link
        to={tool.path}
        className={[
          baseCardClasses,
          "hover:shadow-card-hover hover:-translate-y-0.5 hover:border-neutral-300",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-primary-700 focus-visible:ring-offset-2",
          "cursor-pointer",
        ].join(" ")}
        aria-label={`${tool.name} — Disponible`}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div
      className={[baseCardClasses, "cursor-default"].join(" ")}
      aria-disabled="true"
      role="article"
      aria-label={`${tool.name} — Bientôt disponible`}
    >
      {cardContent}
    </div>
  );
}
