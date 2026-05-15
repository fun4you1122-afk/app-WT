export const Colors = {
  background: '#050A18',
  backgroundSecondary: '#080E20',
  backgroundTertiary: '#0A1228',

  surface: 'rgba(255,255,255,0.04)',
  surfaceHover: 'rgba(255,255,255,0.08)',
  border: 'rgba(255,255,255,0.08)',
  borderGlow: 'rgba(0,212,255,0.3)',

  neonBlue: '#00D4FF',
  neonCyan: '#00F5FF',
  neonPurple: '#BF5FFF',
  neonPink: '#FF2D92',
  electricBlue: '#0066FF',

  gradientPrimary: ['#00D4FF', '#0066FF'] as const,
  gradientSecondary: ['#BF5FFF', '#FF2D92'] as const,
  gradientDark: ['#050A18', '#0A1228'] as const,
  gradientCard: ['rgba(0,212,255,0.1)', 'rgba(0,102,255,0.05)'] as const,
  gradientGlow: ['rgba(0,212,255,0.15)', 'transparent'] as const,

  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.7)',
  textMuted: 'rgba(255,255,255,0.4)',
  textNeon: '#00D4FF',

  success: '#00FF88',
  warning: '#FFB800',
  error: '#FF2D55',
  info: '#00D4FF',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export type ColorKey = keyof typeof Colors;
