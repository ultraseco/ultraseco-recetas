// =========================================================================
// HELPER DE ICONOS INDUSTRIALES (LUCIDE SVG)
// =========================================================================
import * as lucide from "lucide";

/**
 * Convierte un nombre de icono (ej: 'FlaskConical', 'Activity', 'ShieldCheck')
 * en un string SVG HTML válido para insertar en template literals.
 */
export function icon(name, options = {}) {
  const {
    size = 18,
    className = "",
    stroke = "currentColor",
    strokeWidth = 2
  } = options;

  const iconDef = lucide[name] || lucide["HelpCircle"] || [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["line", { x1: "12", y1: "8", x2: "12", y2: "12" }],
    ["line", { x1: "12", y1: "16", x2: "12.01", y2: "16" }]
  ];

  const childrenHtml = iconDef
    .map(([tag, attrs]) => {
      const attrStr = Object.entries(attrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ");
      return `<${tag} ${attrStr}></${tag}>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="inline-icon ${className}">${childrenHtml}</svg>`;
}
