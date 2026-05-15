export const Colors = {
  // Backgrounds
  background: '#F4F6FF',
  surface: '#FFFFFF',
  surfaceSecondary: '#F8FAFF',
  surfaceTertiary: '#EEF2FF',

  // Primary Blue
  primary: '#0055FF',
  primaryLight: '#E8EFFE',
  primaryDark: '#003ECC',

  // Accent Purple
  accent: '#7C3AED',
  accentLight: '#EDE9FE',

  // Cyan
  cyan: '#0EA5E9',
  cyanLight: '#E0F2FE',

  // Status
  success: '#059669',
  successLight: '#D1FAE5',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  error: '#DC2626',
  errorLight: '#FEE2E2',

  // Text
  text: '#0A1628',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  // Borders & Dividers
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  // Gradients
  gradientPrimary: ['#0055FF', '#003ECC'] as const,
  gradientAccent: ['#7C3AED', '#5B21B6'] as const,
  gradientCyan: ['#0EA5E9', '#0284C7'] as const,
  gradientWarm: ['#F59E0B', '#D97706'] as const,
  gradientSuccess: ['#059669', '#047857'] as const,
  gradientSky: ['#E8EFFE', '#EDE9FE'] as const,
  gradientHero: ['#0055FF', '#7C3AED'] as const,

  // Legacy aliases kept for compatibility
  neonBlue: '#0055FF',
  neonCyan: '#0EA5E9',
  neonPurple: '#7C3AED',
  electricBlue: '#003ECC',
  neonGreen: '#059669',
  white: '#FFFFFF',
  black: '#0A1628',
  transparent: 'transparent',
};

export type ColorKey = keyof typeof Colors;
