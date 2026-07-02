import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export type PaletteId =
  | 'emerald-prestige'
  | 'midnight-indigo'
  | 'ocean-deep'
  | 'warm-sand'
  | 'noir-gold'
  | 'cloud-white';

export type FontPairId =
  | 'libre-plex'
  | 'space-dm'
  | 'instrument-work'
  | 'jakarta-inter';

export type Density = 'compact' | 'comfortable' | 'spacious';

interface Palette {
  id: PaletteId;
  label: string;
  swatch: string[];
  vars: Record<string, string>; // HSL "h s% l%"
  varsDark?: Record<string, string>;
}

interface FontPair {
  id: FontPairId;
  label: string;
  heading: string;
  body: string;
}

export const PALETTES: Palette[] = [
  {
    id: 'emerald-prestige',
    label: 'Emerald Prestige',
    swatch: ['#064e3b', '#0d7a5f', '#c9a84c', '#f5f0e0'],
    vars: {
      background: '44 33% 92%', foreground: '158 78% 10%',
      card: '44 40% 96%', 'card-foreground': '158 78% 10%',
      popover: '44 40% 96%', 'popover-foreground': '158 78% 10%',
      primary: '158 78% 17%', 'primary-foreground': '44 40% 96%',
      secondary: '44 25% 86%', 'secondary-foreground': '158 78% 10%',
      muted: '44 20% 88%', 'muted-foreground': '158 15% 30%',
      accent: '43 55% 54%', 'accent-foreground': '158 78% 10%',
      border: '44 20% 80%', input: '44 20% 82%', ring: '158 78% 17%',
      'sidebar-background': '44 35% 94%', 'sidebar-foreground': '158 78% 10%',
      'sidebar-primary': '158 78% 17%', 'sidebar-accent': '44 25% 88%',
      'sidebar-border': '44 20% 82%',
    },
  },
  {
    id: 'midnight-indigo',
    label: 'Midnight Indigo',
    swatch: ['#0a0a1a', '#141432', '#1e1e5a', '#4f46e5'],
    vars: {
      background: '240 30% 96%', foreground: '240 40% 10%',
      card: '0 0% 100%', 'card-foreground': '240 40% 10%',
      popover: '0 0% 100%', 'popover-foreground': '240 40% 10%',
      primary: '243 75% 58%', 'primary-foreground': '0 0% 100%',
      secondary: '240 20% 92%', 'secondary-foreground': '240 40% 10%',
      muted: '240 20% 94%', 'muted-foreground': '240 10% 40%',
      accent: '260 70% 60%', 'accent-foreground': '0 0% 100%',
      border: '240 15% 86%', input: '240 15% 88%', ring: '243 75% 58%',
      'sidebar-background': '240 25% 12%', 'sidebar-foreground': '240 20% 92%',
      'sidebar-primary': '243 75% 65%', 'sidebar-accent': '240 25% 18%',
      'sidebar-border': '240 25% 20%',
    },
  },
  {
    id: 'ocean-deep',
    label: 'Ocean Deep',
    swatch: ['#0c2340', '#1a4a6e', '#2d8a9e', '#5cbdb9'],
    vars: {
      background: '200 40% 96%', foreground: '210 60% 12%',
      card: '0 0% 100%', 'card-foreground': '210 60% 12%',
      popover: '0 0% 100%', 'popover-foreground': '210 60% 12%',
      primary: '210 60% 20%', 'primary-foreground': '200 40% 96%',
      secondary: '200 30% 88%', 'secondary-foreground': '210 60% 12%',
      muted: '200 25% 90%', 'muted-foreground': '210 30% 35%',
      accent: '188 60% 40%', 'accent-foreground': '0 0% 100%',
      border: '200 20% 82%', input: '200 20% 84%', ring: '210 60% 20%',
      'sidebar-background': '210 50% 14%', 'sidebar-foreground': '200 40% 94%',
      'sidebar-primary': '188 60% 50%', 'sidebar-accent': '210 40% 20%',
      'sidebar-border': '210 40% 22%',
    },
  },
  {
    id: 'warm-sand',
    label: 'Warm Sand',
    swatch: ['#faf8f5', '#f0ebe3', '#c9b99a', '#8b7355'],
    vars: {
      background: '38 40% 96%', foreground: '28 30% 15%',
      card: '38 45% 98%', 'card-foreground': '28 30% 15%',
      popover: '38 45% 98%', 'popover-foreground': '28 30% 15%',
      primary: '28 30% 30%', 'primary-foreground': '38 40% 96%',
      secondary: '35 25% 88%', 'secondary-foreground': '28 30% 15%',
      muted: '35 20% 90%', 'muted-foreground': '28 15% 40%',
      accent: '32 40% 55%', 'accent-foreground': '28 30% 15%',
      border: '35 20% 82%', input: '35 20% 84%', ring: '28 30% 30%',
      'sidebar-background': '35 35% 92%', 'sidebar-foreground': '28 30% 15%',
      'sidebar-primary': '28 30% 30%', 'sidebar-accent': '35 25% 86%',
      'sidebar-border': '35 20% 82%',
    },
  },
  {
    id: 'noir-gold',
    label: 'Noir & Gold',
    swatch: ['#0d0d0d', '#1a1a1a', '#c9a84c', '#f0d78c'],
    vars: {
      background: '0 0% 8%', foreground: '43 45% 92%',
      card: '0 0% 11%', 'card-foreground': '43 45% 92%',
      popover: '0 0% 11%', 'popover-foreground': '43 45% 92%',
      primary: '43 60% 55%', 'primary-foreground': '0 0% 8%',
      secondary: '0 0% 16%', 'secondary-foreground': '43 45% 92%',
      muted: '0 0% 15%', 'muted-foreground': '43 15% 70%',
      accent: '43 70% 65%', 'accent-foreground': '0 0% 8%',
      border: '0 0% 20%', input: '0 0% 22%', ring: '43 60% 55%',
      'sidebar-background': '0 0% 6%', 'sidebar-foreground': '43 45% 92%',
      'sidebar-primary': '43 60% 55%', 'sidebar-accent': '0 0% 14%',
      'sidebar-border': '0 0% 18%',
    },
  },
  {
    id: 'cloud-white',
    label: 'Cloud White',
    swatch: ['#fafbfc', '#e8ecf1', '#94a3b8', '#3b82f6'],
    vars: {
      background: '210 20% 98%', foreground: '215 30% 15%',
      card: '0 0% 100%', 'card-foreground': '215 30% 15%',
      popover: '0 0% 100%', 'popover-foreground': '215 30% 15%',
      primary: '217 91% 60%', 'primary-foreground': '0 0% 100%',
      secondary: '210 20% 94%', 'secondary-foreground': '215 30% 15%',
      muted: '210 20% 95%', 'muted-foreground': '215 15% 40%',
      accent: '217 91% 60%', 'accent-foreground': '0 0% 100%',
      border: '215 20% 88%', input: '215 20% 90%', ring: '217 91% 60%',
      'sidebar-background': '210 20% 97%', 'sidebar-foreground': '215 30% 15%',
      'sidebar-primary': '217 91% 60%', 'sidebar-accent': '210 20% 92%',
      'sidebar-border': '215 20% 88%',
    },
  },
];

export const FONT_PAIRS: FontPair[] = [
  { id: 'libre-plex', label: 'Libre Baskerville + IBM Plex', heading: '"Libre Baskerville", Georgia, serif', body: '"IBM Plex Sans", system-ui, sans-serif' },
  { id: 'space-dm', label: 'Space Grotesk + DM Sans', heading: '"Space Grotesk", system-ui, sans-serif', body: '"DM Sans", system-ui, sans-serif' },
  { id: 'instrument-work', label: 'Instrument Serif + Work Sans', heading: '"Instrument Serif", Georgia, serif', body: '"Work Sans", system-ui, sans-serif' },
  { id: 'jakarta-inter', label: 'Plus Jakarta Sans + Inter', heading: '"Plus Jakarta Sans", system-ui, sans-serif', body: '"Inter", system-ui, sans-serif' },
];

const DENSITY_VARS: Record<Density, { radius: string; scale: string }> = {
  compact: { radius: '0.35rem', scale: '0.94' },
  comfortable: { radius: '0.5rem', scale: '1' },
  spacious: { radius: '0.75rem', scale: '1.06' },
};

interface AppearanceState {
  palette: PaletteId;
  fontPair: FontPairId;
  density: Density;
  accent: string | null; // hex override or null
  setPalette: (p: PaletteId) => void;
  setFontPair: (f: FontPairId) => void;
  setDensity: (d: Density) => void;
  setAccent: (hex: string | null) => void;
  reset: () => void;
}

const Ctx = createContext<AppearanceState | null>(null);

const KEY = 'fedhaflow-appearance';

function hexToHsl(hex: string): string | null {
  const m = hex.trim().replace('#', '');
  if (!/^([0-9a-f]{6}|[0-9a-f]{3})$/i.test(m)) return null;
  const full = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [palette, setPaletteState] = useState<PaletteId>('emerald-prestige');
  const [fontPair, setFontPairState] = useState<FontPairId>('libre-plex');
  const [density, setDensityState] = useState<Density>('comfortable');
  const [accent, setAccentState] = useState<string | null>(null);

  // Load on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p.palette) setPaletteState(p.palette);
        if (p.fontPair) setFontPairState(p.fontPair);
        if (p.density) setDensityState(p.density);
        if (p.accent !== undefined) setAccentState(p.accent);
      }
    } catch { /* ignore */ }
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ palette, fontPair, density, accent }));
  }, [palette, fontPair, density, accent]);

  // Apply CSS vars
  useEffect(() => {
    const root = document.documentElement;
    const p = PALETTES.find((x) => x.id === palette) || PALETTES[0];
    Object.entries(p.vars).forEach(([k, v]) => root.style.setProperty(`--${k}`, v));
    if (accent) {
      const hsl = hexToHsl(accent);
      if (hsl) {
        root.style.setProperty('--accent', hsl);
        root.style.setProperty('--ring', hsl);
      }
    }
    const fp = FONT_PAIRS.find((x) => x.id === fontPair) || FONT_PAIRS[0];
    root.style.setProperty('--font-heading', fp.heading);
    root.style.setProperty('--font-body', fp.body);
    const d = DENSITY_VARS[density];
    root.style.setProperty('--radius', d.radius);
    root.style.setProperty('--density-scale', d.scale);
    root.setAttribute('data-density', density);
  }, [palette, fontPair, density, accent]);

  const value = useMemo<AppearanceState>(() => ({
    palette, fontPair, density, accent,
    setPalette: setPaletteState,
    setFontPair: setFontPairState,
    setDensity: setDensityState,
    setAccent: setAccentState,
    reset: () => {
      setPaletteState('emerald-prestige');
      setFontPairState('libre-plex');
      setDensityState('comfortable');
      setAccentState(null);
    },
  }), [palette, fontPair, density, accent]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppearance() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppearance must be used within AppearanceProvider');
  return ctx;
}
