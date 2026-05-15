export const Typography = {
  displayXL: { fontSize: 48, fontWeight: '800' as const, letterSpacing: -1.5 },
  displayLG: { fontSize: 36, fontWeight: '700' as const, letterSpacing: -1 },
  displayMD: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  headingLG: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  headingMD: { fontSize: 18, fontWeight: '600' as const, letterSpacing: -0.2 },
  headingSM: { fontSize: 15, fontWeight: '600' as const },
  bodyLG: { fontSize: 16, fontWeight: '400' as const, lineHeight: 26 },
  bodyMD: { fontSize: 14, fontWeight: '400' as const, lineHeight: 22 },
  bodySM: { fontSize: 12, fontWeight: '400' as const, lineHeight: 18 },
  caption: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.3 },
  label: { fontSize: 10, fontWeight: '700' as const, letterSpacing: 1.2 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 999,
};

export const Shadow = {
  sm: {
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  primary: {
    shadowColor: '#0055FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  accent: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  // Legacy
  card: {
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  neonBlue: {
    shadowColor: '#0055FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  neonPurple: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
};
