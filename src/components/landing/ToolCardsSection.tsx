import type { Tool } from "../../types/tool";
import { ToolCard } from "./ToolCard";

interface ToolCardsSectionProps {
  tools: Tool[];
}

export function ToolCardsSection({ tools }: ToolCardsSectionProps) {
  return (
    <section
      className="bg-neutral-50 py-16 md:py-24 px-4 sm:px-6 lg:px-8"
      aria-labelledby="tools-heading"
      id="outils"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section label + heading */}
        <div className="mb-10 md:mb-14">
          <p className="text-xs font-medium uppercase tracking-widest text-primary-700 mb-2">
            Nos outils
          </p>
          <h2
            id="tools-heading"
            className="text-2xl md:text-3xl font-bold text-neutral-900"
          >
            Planifiez votre avenir financier
          </h2>
        </div>

        {/* Tool cards grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 list-none p-0">
          {tools.map((tool) => (
            <li key={tool.id}>
              <ToolCard tool={tool} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
