export const Typography = {
  displayXL: { fontSize: 48, fontWeight: '800' as const, letterSpacing: -1 },
  displayLG: { fontSize: 36, fontWeight: '700' as const, letterSpacing: -0.5 },
  displayMD: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.3 },
  headingLG: { fontSize: 24, fontWeight: '600' as const, letterSpacing: -0.2 },
  headingMD: { fontSize: 20, fontWeight: '600' as const },
  headingSM: { fontSize: 17, fontWeight: '600' as const },
  bodyLG: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMD: { fontSize: 14, fontWeight: '400' as const, lineHeight: 22 },
  bodySM: { fontSize: 12, fontWeight: '400' as const, lineHeight: 18 },
  caption: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.5 },
  label: { fontSize: 10, fontWeight: '600' as const, letterSpacing: 1.5 },
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
  xl: 24,
  xxl: 32,
  full: 999,
};

export const Shadow = {
  neonBlue: {
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  neonPurple: {
    shadowColor: '#BF5FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
};
