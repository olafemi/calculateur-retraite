/**
 * Format a number as FCFA currency using French locale.
 * Example: 1000 -> "1 000 F CFA"
 */
export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(amount) + "\u00a0F CFA";
}
