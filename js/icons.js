/**
 * Lucide Icons — helpers para SVG consistentes no projeto.
 */
const ICON_DEFAULTS = {
  desastre: 'biohazard',
  procurar: 'layers',
  medidor: 'gauge',
};

const EMOJI_TO_LUCIDE = {
  '🧊': 'snowflake',
  '🐻‍❄️': 'paw-print',
  '🐻‍❄': 'paw-print',
  '🫧': 'droplets',
  '🌊': 'waves',
  '🪸': 'fish',
  '🛢️': 'fuel',
  '🛢': 'fuel',
  '🔴': 'circle',
  '🔥': 'flame',
  '⚡': 'zap',
  '🏜️': 'sun',
  '🏜': 'sun',
  '🌡️': 'thermometer',
  '🌡': 'thermometer',
  '🌿': 'leaf',
  '☣️': 'biohazard',
  '☣': 'biohazard',
  '🛣️': 'route',
  '🛣': 'route',
  '🏭': 'factory',
  '🌧️': 'cloud-rain',
  '🌧': 'cloud-rain',
  '💡': 'lightbulb',
  '🌍': 'globe',
  '🌋': 'mountain',
  '⛈️': 'cloud-lightning',
  '⛈': 'cloud-lightning',
  '⛰️': 'mountain',
  '⛰': 'mountain',
  '🔍': 'search',
  '🫁': 'wind',
  '⚗️': 'flask-conical',
  '⚗': 'flask-conical',
  '🧪': 'test-tube',
  '⏭️': 'skip-forward',
  '⏭': 'skip-forward',
  '☢': 'biohazard',
  '☢️': 'biohazard',
  '🃏': 'layers',
};

function normalizeEmoji(value) {
  return String(value).replace(/\uFE0F/g, '');
}

function resolveIconName(name, fallback = ICON_DEFAULTS.desastre) {
  if (!name) return fallback;

  const trimmed = String(name).trim();
  const normalized = normalizeEmoji(trimmed);

  if (EMOJI_TO_LUCIDE[trimmed]) return EMOJI_TO_LUCIDE[trimmed];
  if (EMOJI_TO_LUCIDE[normalized]) return EMOJI_TO_LUCIDE[normalized];

  if (/[^\x00-\x7F]/.test(trimmed)) return fallback;

  return trimmed;
}

function toLucideName(name) {
  return name.replace(/(\w)(\w*)(_|-|\s*)/g, (_, c, p) => c.toUpperCase() + p.toLowerCase());
}

function getLucideIconDef(name) {
  if (!name || typeof lucide === 'undefined') return null;
  const resolved = resolveIconName(name, null);
  if (!resolved) return null;
  const pascal = toLucideName(resolved);
  return lucide.icons?.[pascal] || lucide[pascal] || null;
}

function icon(name, className, fallback) {
  const iconName = resolveIconName(name, fallback || ICON_DEFAULTS.desastre);
  const cls = className ? ` class="${className}"` : '';
  return `<span data-lucide="${iconName}"${cls} aria-hidden="true"></span>`;
}

function refreshIcons(root) {
  if (typeof lucide === 'undefined') return;

  const scope = root || document;
  scope.querySelectorAll('[data-lucide]').forEach((element) => {
    if (element.closest('svg') || element.tagName === 'SVG') return;

    const rawName = element.getAttribute('data-lucide');
    if (!rawName) return;

    const iconName = resolveIconName(rawName);
    const iconDef = getLucideIconDef(iconName);
    if (!iconDef) {
      console.warn(`[icons] Ícone não encontrado: ${rawName} → ${iconName}`);
      return;
    }

    const svg = lucide.createElement(iconDef);

    Array.from(element.attributes).forEach((attr) => {
      if (attr.name === 'data-lucide') return;
      svg.setAttribute(attr.name, attr.value);
    });

    svg.classList.add('lucide', `lucide-${iconName}`);
    if (!svg.getAttribute('stroke-width')) svg.setAttribute('stroke-width', '2');
    svg.setAttribute('aria-hidden', 'true');

    element.replaceWith(svg);
  });
}

function normalizarIconeCarta(carta) {
  if (!carta || !carta.icone) return carta;
  carta.icone = resolveIconName(carta.icone, ICON_DEFAULTS.desastre);
  return carta;
}
