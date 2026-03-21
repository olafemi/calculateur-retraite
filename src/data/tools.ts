import type { Tool } from "../types/tool";

export const TOOLS: Tool[] = [
  {
    id: "retraite",
    name: "Calculateur de Retraite",
    description: "Calculez combien épargner chaque mois pour maintenir votre niveau de vie à la retraite.",
    path: "/outils/retraite",
    status: "available",
    icon: "🐖",
  },
  {
    id: "millions",
    name: "Road to Millions",
    description: "Découvrez combien de temps il vous faudra pour atteindre vos objectifs de patrimoine.",
    path: "/outils/millions",
    status: "coming_soon",
    icon: "📈",
  },
];
