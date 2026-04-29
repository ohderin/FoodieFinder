/** Hi-Fi palette (WCAG AA reds). */
export const FF_LIGHT = {
  red: "#e63946",
  redLight: "#FDE8EA",
  redDark: "#8F1D27",
  orange: "#FF7F00",
  golden: "#ffd166",
  cream: "#fff8f0",
  cream2: "#F5EDE2",
  dark: "#2b2b2b",
  med: "#5C4B3A",
  light: "#9C8B7A",
  border: "#E8D9C8",
  green: "#2D7D46",
} as const;

export const FF_DARK = {
  red: "#e63946",
  redLight: "#8F1D27",
  redDark: "#FDE8EA",
  orange: "#FF7F00",
  golden: "#ffd166",
  cream: "#121212",
  cream2: "#1D1D1D",
  dark: "#F5F1EA",
  med: "#D3C5B8",
  light: "#A49485",
  border: "#3A332D",
  green: "#2D7D46",
} as const;

export type FFColors = typeof FF_LIGHT;

export function getFFColors(isDarkMode: boolean): FFColors {
  return isDarkMode ? FF_DARK : FF_LIGHT;
}

export const FF = FF_LIGHT;
