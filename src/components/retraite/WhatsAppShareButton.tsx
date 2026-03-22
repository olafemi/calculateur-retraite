/**
 * WhatsAppShareButton — Shares retirement simulation results via WhatsApp.
 *
 * Flow:
 * 1. User clicks the button
 * 2. A branded image card is generated via Canvas API (no dependencies)
 * 3. Mobile (touch device): Web Share API shares image + text
 * 4. Desktop: downloads image + opens wa.me with text
 */
import { useState, useCallback } from "react";

interface WhatsAppShareButtonProps {
  prenom: string;
  epargneMensuelle: number;
  capitalCible: number;
  yearsToRetirement: number;
  retirementAge: number;
  capitalDisponible: number;
  retirementDurationYears: number;
  revenuRetraite: number;
  annualReturnRate: number;
  totalContributions: number;
  totalInterestEarned: number;
  savingsRatePercent: number;
  statut: string | null;
  currentSalary: number;
}

/** Format number with regular spaces as thousand separators (visible everywhere). */
function fmt(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** Detect mobile/touch device (Web Share API makes sense here) */
function isMobileDevice(): boolean {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

/**
 * Generate a viral roasting verdict.
 *
 * Context: Benin, SMIC = 52 000 FCFA/mois, tone = roasting/argot,
 * adapted per statut (salarie, freelance, etudiant, autre/sans emploi).
 */
const SMIC_BENIN = 52_000;

function getViralVerdict(
  savingsRatePercent: number,
  annualReturnRate: number,
  yearsToRetirement: number,
  revenuRetraite: number,
  epargneMensuelle: number,
  currentSalary: number,
  statut: string | null
): { emoji: string; label: string; text: string } {
  const hasNoSalary = currentSalary <= 0;
  const isEtudiant = statut === "etudiant";
  const isFreelance = statut === "freelance";
  const earnsBelowSmic = currentSalary > 0 && currentSalary <= SMIC_BENIN;
  const rv = fmt(revenuRetraite);
  const ep = fmt(epargneMensuelle);
  const sal = fmt(currentSalary);
  const pct = Math.round(savingsRatePercent);
  const retPct = (annualReturnRate * 100).toFixed(1).replace(".", ",");

  // ── Pas de salaire déclaré ──
  if (hasNoSalary && !isEtudiant) {
    if (revenuRetraite > 1_000_000) {
      return {
        emoji: "\uD83E\uDD2F",
        label: "LE REVE EST PERMIS",
        text: `Pas de salaire declare mais tu veux toucher ${rv} F CFA a la retraite ? Mon gars, commence par trouver le premier wari. Le reste c'est Netflix.`,
      };
    }
    return {
      emoji: "\uD83E\uDDD8",
      label: "MODE SURVIE",
      text: `Zero revenu mais tu veux ${rv} F CFA a la retraite ? L'intention est la, c'est deja ca. Maintenant faut trouver le wari pour mettre ${ep} F CFA de cote chaque mois.`,
    };
  }

  // ── Etudiant ──
  if (isEtudiant) {
    return {
      emoji: "\uD83C\uDF93",
      label: "ETUDIANT AMBITIEUX",
      text: `Tu n'as meme pas encore recu ton premier salaire et tu veux toucher ${rv} F CFA par mois a la retraite ? Ca veut dire ${ep} F CFA d'epargne par mois. Finis tes cours d'abord djo, on en reparle apres.`,
    };
  }

  // ── Rendement irréaliste ──
  if (annualReturnRate > 0.15) {
    return {
      emoji: "\uD83D\uDE80",
      label: "ASTRONAUTE FINANCIER",
      text: `${retPct}% de rendement annuel ? Meme Warren Buffett fait 20% et il est milliardaire. Tu investis ou exactement, dans les reves ? Avec les pieds sur terre, faudrait mettre bien plus que ${ep} F CFA par mois.`,
    };
  }

  // ── Rendement à 0% ──
  if (annualReturnRate === 0 && yearsToRetirement > 10) {
    return {
      emoji: "\uD83D\uDECF\uFE0F",
      label: "MODE MATELAS",
      text: `Zero rendement, tu gardes tes ${ep} F CFA par mois sous le lit comme grand-mere ? L'inflation va te grignoter ca doucement comme le termite mange le bois. Investis un minimum djo !`,
    };
  }

  // ── Epargne > 100% du salaire ──
  if (savingsRatePercent > 100) {
    if (earnsBelowSmic) {
      return {
        emoji: "\uD83D\uDCA8",
        label: "IMPOSSIBLE TOTAL",
        text: `Djo, tu gagnes ${sal} F CFA et tu veux mettre ${ep} F CFA de cote ? C'est ${pct}% de ton salaire. Meme Dangote a pas commence comme ca. Revois le plan ou augmente les revenus d'abord.`,
      };
    }
    return {
      emoji: "\uD83E\uDD21",
      label: "MISSION IMPOSSIBLE",
      text: `${ep} F CFA d'epargne par mois sur un salaire de ${sal} F CFA ? Ca fait ${pct}% djo. C'est pas de l'ambition, c'est de la science-fiction. Redescends sur terre.`,
    };
  }

  // ── Epargne > 70% ──
  if (savingsRatePercent > 70) {
    return {
      emoji: "\uD83D\uDE2D",
      label: "IRRATIONNEL",
      text: `${pct}% de ton salaire en epargne, soit ${ep} F CFA par mois. Tu comptes manger quoi ? De l'air et de l'ambition ? Meme le jeune du Ramadan c'est qu'un mois hein.`,
    };
  }

  // ── Epargne > 50% ──
  if (savingsRatePercent > 50) {
    return {
      emoji: "\uD83D\uDE05",
      label: "HARDCORE",
      text: `${ep} F CFA par mois, c'est ${pct}% de ton wari. T'es sur c'est pas un voeu de careme ? Pour toucher ${rv} F CFA a la retraite, faut souffrir un peu.`,
    };
  }

  // ── Freelance spécifique ──
  if (isFreelance && savingsRatePercent > 30) {
    return {
      emoji: "\uD83C\uDFAF",
      label: "FREELANCE WARRIOR",
      text: `Freelance et ${ep} F CFA d'epargne par mois, soit ${pct}% de tes revenus ? Tu sais que ca peut changer chaque mois non ? Chapeau si tu tiens. Garde un matelas de securite quand meme.`,
    };
  }

  // ── Salaire au SMIC ──
  if (earnsBelowSmic && savingsRatePercent > 20) {
    return {
      emoji: "\uD83D\uDCAA",
      label: "GUERRIER DU SMIC",
      text: `Au SMIC a ${sal} F CFA et tu veux mettre ${ep} F CFA de cote ? C'est ${pct}% de ton salaire. Chaque franc compte. T'es un(e) vrai(e) la, respect.`,
    };
  }

  // ── Timeline très courte ──
  if (yearsToRetirement <= 3) {
    return {
      emoji: "\u23F0",
      label: "REVEIL TARDIF",
      text: `Il te reste ${yearsToRetirement} an${yearsToRetirement > 1 ? "s" : ""} et tu veux ${rv} F CFA par mois a la retraite ? Ca fait ${ep} F CFA a mettre de cote chaque mois. C'est maintenant que tu te reveilles djo ?`,
    };
  }

  if (yearsToRetirement <= 5) {
    return {
      emoji: "\uD83D\uDD25",
      label: "DERNIERE LIGNE DROITE",
      text: `${yearsToRetirement} ans pour accumuler de quoi toucher ${rv} F CFA par mois. ${ep} F CFA d'epargne chaque mois, pas le moment de tchiller. Mets le paquet.`,
    };
  }

  // ── Revenu retraite très élevé (> 5M) ──
  if (revenuRetraite > 5_000_000) {
    return {
      emoji: "\uD83D\uDC51",
      label: "LIFESTYLE DE ROI",
      text: `${rv} F CFA par mois a la retraite ? C'est pas une retraite ca, c'est un lifestyle de ministre. Faut mettre ${ep} F CFA de cote chaque mois. Tu manges du homard a Cotonou tous les jours ou bien ?`,
    };
  }

  // ── Confortable (< 10%) avec du temps ──
  if (savingsRatePercent > 0 && savingsRatePercent <= 10 && yearsToRetirement >= 20) {
    return {
      emoji: "\uD83C\uDF1F",
      label: "TRANQUILLE",
      text: `${ep} F CFA par mois, c'est que ${pct}% de ton salaire. Pour toucher ${rv} F CFA a la retraite, c'est le scenario reve. Le plus dur c'est de commencer, arrete de reflechir.`,
    };
  }

  // ── Effort modéré (10-30%) ──
  if (savingsRatePercent <= 30) {
    return {
      emoji: "\u2705",
      label: "REALISTE",
      text: `${ep} F CFA par mois pour toucher ${rv} F CFA a la retraite. C'est jouable. Avec de la discipline, tu seras le tonton ou la tantie que tout le quartier respecte. On est ensemble !`,
    };
  }

  // ── Default ──
  return {
    emoji: "\uD83D\uDCAA",
    label: "AMBITIEUX",
    text: `${ep} F CFA par mois pour viser ${rv} F CFA a la retraite. Ca va demander des sacrifices mais c'est faisable. Commence aujourd'hui, ton futur toi va te remercier grave.`,
  };
}

// ---------------------------------------------------------------------------
// Canvas image generation — branded results card (white background)
// ---------------------------------------------------------------------------

function generateShareImage(props: WhatsAppShareButtonProps): Promise<Blob> {
  const {
    prenom,
    epargneMensuelle,
    capitalCible,
    yearsToRetirement,
    retirementAge,
    capitalDisponible,
    retirementDurationYears,
    annualReturnRate,
    totalContributions,
    totalInterestEarned,
    savingsRatePercent,
  } = props;

  const verdict = getViralVerdict(savingsRatePercent, annualReturnRate, yearsToRetirement, props.revenuRetraite, epargneMensuelle, props.currentSalary, props.statut);
  const hasCapital = capitalDisponible > 0;
  const returnPct = (annualReturnRate * 100).toFixed(1).replace(".", ",");

  const W = 1080;
  const H = 1920; // taller to fit all data + verdict
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  // ── White background ──
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, W, H);

  // ── Top accent bar ──
  ctx.fillStyle = "#1A6B5E";
  ctx.fillRect(0, 0, W, 8);

  // ── Header ──
  ctx.fillStyle = "#1A6B5E";
  ctx.font = `700 32px ${font}`;
  ctx.fillText("Assu - Planificateur de retraite", 60, 65);

  ctx.strokeStyle = "#E5E7EB";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 95);
  ctx.lineTo(W - 60, 95);
  ctx.stroke();

  // ── Greeting ──
  ctx.fillStyle = "#374151";
  ctx.font = `400 30px ${font}`;
  ctx.fillText(`Simulation de ${prenom || "retraite"}`, 60, 145);

  // ── Hero 1: Desired retirement income (bigger, green) ──
  ctx.fillStyle = "#6B7280";
  ctx.font = `500 26px ${font}`;
  ctx.fillText("Je veux toucher a la retraite", 60, 220);

  ctx.fillStyle = "#1A6B5E";
  ctx.font = `800 80px ${font}`;
  ctx.fillText(`${fmt(props.revenuRetraite)} F CFA`, 60, 310);

  ctx.fillStyle = "#9CA3AF";
  ctx.font = `400 26px ${font}`;
  ctx.fillText("par mois", 60, 350);

  // ── Hero 2: Monthly savings effort (accent gold) ──
  ctx.fillStyle = "#6B7280";
  ctx.font = `500 26px ${font}`;
  ctx.fillText("Mon effort mensuel", 60, 420);

  ctx.fillStyle = "#D4860A";
  ctx.font = `800 68px ${font}`;
  ctx.fillText(`${fmt(epargneMensuelle)} F CFA`, 60, 500);

  ctx.fillStyle = "#9CA3AF";
  ctx.font = `400 26px ${font}`;
  ctx.fillText("par mois", 60, 540);

  // ── Verdict badge (dynamic height based on text wrapping) ──
  const badgeY = 585;
  const badgeR = 12;
  const badgeLineH = 32;    // line height for verdict body text
  const badgeTextStart = 70; // first text line Y offset from badgeY
  const badgePadBottom = 20; // bottom padding after last text line

  // Pre-measure verdict text lines to compute dynamic badge height
  ctx.font = `400 26px ${font}`;
  const maxTextW = W - 170;
  const words = verdict.text.split(" ");
  const wrappedLines: string[] = [];
  let measureLine = "";
  for (const word of words) {
    const test = measureLine + (measureLine ? " " : "") + word;
    if (ctx.measureText(test).width > maxTextW && measureLine) {
      wrappedLines.push(measureLine);
      measureLine = word;
    } else {
      measureLine = test;
    }
  }
  if (measureLine) wrappedLines.push(measureLine);

  // Badge height: label area + text lines + bottom padding
  const badgeH = badgeTextStart + (wrappedLines.length - 1) * badgeLineH + badgePadBottom;

  // Badge background color based on severity
  let badgeBg = "#F0FDF4"; // green default
  let badgeBorder = "#16A34A";
  let badgeTextColor = "#166534";
  if (savingsRatePercent > 100) {
    badgeBg = "#FEE2E2"; badgeBorder = "#DC2626"; badgeTextColor = "#991B1B";
  } else if (savingsRatePercent > 70) {
    badgeBg = "#FEF3C7"; badgeBorder = "#D97706"; badgeTextColor = "#92400E";
  } else if (savingsRatePercent > 50 || annualReturnRate > 0.15) {
    badgeBg = "#FEF3C7"; badgeBorder = "#D97706"; badgeTextColor = "#92400E";
  } else if (savingsRatePercent > 20) {
    badgeBg = "#EFF6FF"; badgeBorder = "#2563EB"; badgeTextColor = "#1E40AF";
  }

  // Draw badge rounded rect (now with correct dynamic height)
  ctx.beginPath();
  ctx.moveTo(60 + badgeR, badgeY);
  ctx.lineTo(W - 60 - badgeR, badgeY);
  ctx.quadraticCurveTo(W - 60, badgeY, W - 60, badgeY + badgeR);
  ctx.lineTo(W - 60, badgeY + badgeH - badgeR);
  ctx.quadraticCurveTo(W - 60, badgeY + badgeH, W - 60 - badgeR, badgeY + badgeH);
  ctx.lineTo(60 + badgeR, badgeY + badgeH);
  ctx.quadraticCurveTo(60, badgeY + badgeH, 60, badgeY + badgeH - badgeR);
  ctx.lineTo(60, badgeY + badgeR);
  ctx.quadraticCurveTo(60, badgeY, 60 + badgeR, badgeY);
  ctx.closePath();
  ctx.fillStyle = badgeBg;
  ctx.fill();
  ctx.strokeStyle = badgeBorder;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Badge label text
  ctx.fillStyle = badgeTextColor;
  ctx.font = `800 28px ${font}`;
  ctx.fillText(`${verdict.emoji}  ${verdict.label}`, 85, badgeY + 38);

  // Render pre-measured verdict text lines
  ctx.font = `400 26px ${font}`;
  let lineY = badgeY + badgeTextStart;
  for (const wrappedLine of wrappedLines) {
    ctx.fillText(wrappedLine, 85, lineY);
    lineY += badgeLineH;
  }

  // ── Details card ──
  const cardX = 40;
  const cardY = badgeY + badgeH + 35;
  const cardW = W - 80;
  const rowCount = 7 + (hasCapital ? 1 : 0);
  const rowH = 72;
  const cardH = rowCount * rowH + 30;
  const cardR = 16;

  // Rounded rect
  ctx.beginPath();
  ctx.moveTo(cardX + cardR, cardY);
  ctx.lineTo(cardX + cardW - cardR, cardY);
  ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + cardR);
  ctx.lineTo(cardX + cardW, cardY + cardH - cardR);
  ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - cardR, cardY + cardH);
  ctx.lineTo(cardX + cardR, cardY + cardH);
  ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - cardR);
  ctx.lineTo(cardX, cardY + cardR);
  ctx.quadraticCurveTo(cardX, cardY, cardX + cardR, cardY);
  ctx.closePath();
  ctx.fillStyle = "#F9FAFB";
  ctx.fill();
  ctx.strokeStyle = "#E5E7EB";
  ctx.lineWidth = 1;
  ctx.stroke();

  const px = cardX + 35;
  let ry = cardY + 45;

  function drawRow(label: string, value: string, highlight?: boolean) {
    ctx.fillStyle = "#6B7280";
    ctx.font = `400 28px ${font}`;
    ctx.fillText(label, px, ry);
    ctx.fillStyle = highlight ? "#1A6B5E" : "#111827";
    ctx.font = `${highlight ? "800" : "700"} 28px ${font}`;
    const vw = ctx.measureText(value).width;
    ctx.fillText(value, cardX + cardW - 35 - vw, ry);
    ry += 20;
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px, ry);
    ctx.lineTo(cardX + cardW - 35, ry);
    ctx.stroke();
    ry += rowH - 20;
  }

  drawRow("Capital a accumuler", `${fmt(capitalCible)} F CFA`, true);
  drawRow("Age de depart", `${retirementAge} ans`);
  drawRow("Duree d'epargne", `${yearsToRetirement} ans`);
  drawRow("Duree de la retraite", `${retirementDurationYears} ans`);
  drawRow("Rendement annuel estime", `${returnPct} %`);
  drawRow("Total de mes versements", `${fmt(totalContributions)} F CFA`);
  drawRow("Interets composes gagnes", `${fmt(totalInterestEarned)} F CFA`);

  if (hasCapital) {
    drawRow("Capital deja disponible", `${fmt(capitalDisponible)} F CFA`);
  }

  // ── CTA ──
  const ctaY = cardY + cardH + 50;

  ctx.fillStyle = "#1A6B5E";
  ctx.font = `600 30px ${font}`;
  ctx.fillText("Fais ta simulation gratuitement !", 60, ctaY);

  ctx.fillStyle = "#9CA3AF";
  ctx.font = `400 26px ${font}`;
  ctx.fillText("assu.bj", 60, ctaY + 45);

  // ── Footer ──
  ctx.fillStyle = "#D1D5DB";
  ctx.font = `400 20px ${font}`;
  ctx.fillText("Simulation a titre indicatif — ne constitue pas un conseil financier", 60, H - 40);

  // ── Bottom accent bar ──
  ctx.fillStyle = "#1A6B5E";
  ctx.fillRect(0, H - 8, W, 8);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      "image/png",
      1.0
    );
  });
}

// ---------------------------------------------------------------------------
// Text message
// ---------------------------------------------------------------------------

function buildShareMessage(props: WhatsAppShareButtonProps): string {
  const {
    epargneMensuelle,
    capitalCible,
    yearsToRetirement,
    retirementAge,
    capitalDisponible,
    retirementDurationYears,
    revenuRetraite,
  } = props;

  const lines = [
    `Salut ! Je viens de faire ma simulation de retraite sur Assu.`,
    `Pour toucher ${fmt(revenuRetraite)} F CFA par mois pendant ${retirementDurationYears} ans de retraite, je dois epargner ${fmt(epargneMensuelle)} F CFA par mois durant ${yearsToRetirement} ans.`,
    ``,
    `Voici mes resultats :`,
    `\u2022 Capital a accumuler : ${fmt(capitalCible)} F CFA`,
    `\u2022 Effort mensuel : ${fmt(epargneMensuelle)} F CFA/mois`,
    `\u2022 Pendant : ${yearsToRetirement} ans (retraite a ${retirementAge} ans)`,
    `\u2022 Duree de la retraite : ${retirementDurationYears} ans`,
  ];

  if (capitalDisponible > 0) {
    lines.push(`\u2022 Capital deja disponible : ${fmt(capitalDisponible)} F CFA`);
  }

  lines.push(
    ``,
    `Fais ta simulation aussi : https://assu.bj`
  );

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function WhatsAppShareButton(props: WhatsAppShareButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleShare = useCallback(async () => {
    setIsGenerating(true);
    try {
      const blob = await generateShareImage(props);
      const file = new File([blob], "ma-simulation-retraite.png", { type: "image/png" });
      const message = buildShareMessage(props);

      // Mobile: use Web Share API (user picks WhatsApp from native menu)
      // Desktop: skip Web Share, go directly to wa.me + download image
      if (isMobileDevice() && navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          text: message,
          files: [file],
        });
      } else {
        // Desktop fallback: download image + open WhatsApp web
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "ma-simulation-retraite.png";
        a.click();
        URL.revokeObjectURL(url);

        setTimeout(() => {
          window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
        }, 500);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        const message = buildShareMessage(props);
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
      }
    } finally {
      setIsGenerating(false);
    }
  }, [props]);

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={isGenerating}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-md font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-[#25D366] text-white hover:bg-[#20BD5A] active:bg-[#1DA851] focus-visible:ring-[#25D366] px-6 py-3 text-base disabled:opacity-60 disabled:cursor-wait"
      aria-label="Partager mes resultats sur WhatsApp"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      {isGenerating ? "Generation..." : "Partager sur WhatsApp"}
    </button>
  );
}
