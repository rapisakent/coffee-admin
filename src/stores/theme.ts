import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';
export type Mode = Theme | 'system';

// Palette values live in tokens.css ([data-palette]); this list only names them.
export const PALETTES = [
  { id: 'teal', label: 'Teal' },
  { id: 'indigo', label: 'Indigo' },
  { id: 'violet', label: 'Tím' },
  { id: 'rose', label: 'Hồng' },
  { id: 'coffee', label: 'Cà phê' },
] as const;
export type Palette = (typeof PALETTES)[number]['id'];

// index.html reads this key before first paint — keep the shape { state: { mode, palette } } in sync.
export const STORAGE_KEY = 'coffee-theme';
const BG: Record<Theme, string> = { light: '#f7f9fa', dark: '#0d1211' };
const media = matchMedia('(prefers-color-scheme: dark)');

const isMode = (v: unknown): v is Mode => v === 'light' || v === 'dark' || v === 'system';
const isPalette = (v: unknown): v is Palette => PALETTES.some((p) => p.id === v);

interface ThemeState {
  mode: Mode;
  palette: Palette;
  systemDark: boolean;
  setMode: (mode: Mode) => void;
  setPalette: (palette: Palette) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      palette: 'teal',
      systemDark: media.matches,
      setMode: (mode) => set({ mode }),
      setPalette: (palette) => set({ palette }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage), // blocked storage → in-memory for this visit
      partialize: ({ mode, palette }) => ({ mode, palette }),
      merge: (saved, current) => {
        const s = saved as Partial<ThemeState> | undefined;
        return {
          ...current,
          mode: isMode(s?.mode) ? s.mode : current.mode,
          palette: isPalette(s?.palette) ? s.palette : current.palette,
        };
      },
    },
  ),
);

const resolve = ({ mode, systemDark }: Pick<ThemeState, 'mode' | 'systemDark'>): Theme =>
  mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;

function apply() {
  const state = useThemeStore.getState();
  const theme = resolve(state);
  const root = document.documentElement;
  if (root.dataset.theme === theme && root.dataset.palette === state.palette) return;
  // mute transitions for one frame so every surface flips together
  root.classList.add('no-transition');
  root.dataset.theme = theme;
  root.dataset.palette = state.palette;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BG[theme]);
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('no-transition')));
}

useThemeStore.subscribe(apply);
media.addEventListener('change', (e) => useThemeStore.setState({ systemDark: e.matches }));
addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY || e.key === null) void useThemeStore.persist.rehydrate();
});
apply();

export function useTheme() {
  const mode = useThemeStore((s) => s.mode);
  const palette = useThemeStore((s) => s.palette);
  const theme = useThemeStore((s) => resolve(s));
  const setMode = useThemeStore((s) => s.setMode);
  const setPalette = useThemeStore((s) => s.setPalette);
  return { mode, palette, theme, setMode, setPalette, toggle: () => setMode(theme === 'dark' ? 'light' : 'dark') };
}
