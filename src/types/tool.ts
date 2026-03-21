/**
 * Represents the availability status of a tool on the platform.
 *   "available"   -- tool is built and accessible
 *   "coming_soon" -- tool is planned but not yet built
 *   "locked"      -- tool exists but requires subscription
 */
export type ToolStatus = "available" | "coming_soon" | "locked";

/**
 * Describes a single planning tool shown on the landing page.
 */
export interface Tool {
  /** Unique machine-readable identifier (e.g. "retraite", "millions") */
  id: string;

  /** Display name shown on the card (French) */
  name: string;

  /** Short description shown below the name (French, max ~80 chars) */
  description: string;

  /** Route path the card links to (e.g. "/outils/retraite") */
  path: string;

  /** Current availability status */
  status: ToolStatus;

  /**
   * Icon identifier — an emoji string or the name of an icon.
   * Defaults to emoji to avoid importing heavy icon libraries.
   */
  icon: string;
}
