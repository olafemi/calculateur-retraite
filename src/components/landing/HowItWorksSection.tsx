interface Step {
  number: number;
  heading: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: 1,
    heading: "Remplissez le formulaire",
    description:
      "Répondez à quelques questions simples sur votre situation et vos objectifs.",
  },
  {
    number: 2,
    heading: "Découvrez vos résultats",
    description:
      "Notre moteur de calcul vous montre exactement ce qu'il vous faut chaque mois.",
  },
  {
    number: 3,
    heading: "Passez à l'action",
    description:
      "Commencez à épargner avec un plan concret adapté à votre vie.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      className="bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section label + heading */}
        <div className="mb-10 md:mb-14 text-center md:text-left">
          <p className="text-xs font-medium uppercase tracking-widest text-primary-700 mb-2">
            Comment ça marche
          </p>
          <h2
            id="how-it-works-heading"
            className="text-2xl md:text-3xl font-bold text-neutral-900"
          >
            Simple comme bonjour
          </h2>
        </div>

        {/* Steps */}
        <ol className="flex flex-col gap-8 md:grid md:grid-cols-3 md:gap-8 md:relative list-none p-0">
          {STEPS.map((step, index) => (
            <li key={step.number} className="relative">
              {/* Connector line (desktop only) — drawn between step 1→2 and 2→3 */}
              {index < STEPS.length - 1 && (
                <div
                  className="hidden md:block absolute top-7 left-[3.5rem] right-0 h-px bg-neutral-200"
                  aria-hidden="true"
                />
              )}

              {/* Step number circle */}
              <div className="w-14 h-14 rounded-full bg-primary-700 text-white flex items-center justify-center text-xl font-extrabold mx-auto md:mx-0 relative z-10">
                {step.number}
              </div>

              {/* Step text */}
              <h3 className="text-base md:text-lg font-bold text-neutral-900 mt-4 mb-1 text-center md:text-left">
                {step.heading}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed text-center md:text-left">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
