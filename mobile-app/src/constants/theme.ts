// ============================================
// DeğerBiç — Mobil Tema Sistemi
// Web'deki CSS değişkenleriyle uyumlu renkler
// ============================================

export const DarkTheme = {
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  primaryDark: '#1e3a8a',
  primaryGlow: 'rgba(59, 130, 246, 0.25)',

  accent: '#10b981',
  accentLight: '#34d399',
  accentGlow: 'rgba(16, 185, 129, 0.25)',

  danger: '#ef4444',
  dangerLight: '#fca5a5',
  dangerBg: 'rgba(239, 68, 68, 0.15)',

  bgPrimary: '#0f172a',
  bgSecondary: '#1e293b',
  bgTertiary: '#334155',
  bgCard: 'rgba(30, 41, 59, 0.95)',

  surface: 'rgba(30, 41, 59, 0.6)',
  surfaceHover: 'rgba(51, 65, 85, 0.7)',
  surfaceBorder: 'rgba(148, 163, 184, 0.15)',

  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  textInverse: '#0f172a',

  tabBarBg: '#0f172a',
  tabBarBorder: 'rgba(148, 163, 184, 0.1)',
};

export const LightTheme = {
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  primaryDark: '#1e3a8a',
  primaryGlow: 'rgba(59, 130, 246, 0.15)',

  accent: '#10b981',
  accentLight: '#34d399',
  accentGlow: 'rgba(16, 185, 129, 0.15)',

  danger: '#ef4444',
  dangerLight: '#fca5a5',
  dangerBg: 'rgba(239, 68, 68, 0.1)',

  bgPrimary: '#f8fafc',
  bgSecondary: '#f1f5f9',
  bgTertiary: '#e2e8f0',
  bgCard: 'rgba(255, 255, 255, 0.95)',

  surface: 'rgba(255, 255, 255, 0.7)',
  surfaceHover: 'rgba(241, 245, 249, 0.9)',
  surfaceBorder: 'rgba(148, 163, 184, 0.25)',

  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  textInverse: '#f1f5f9',

  tabBarBg: '#ffffff',
  tabBarBorder: 'rgba(148, 163, 184, 0.2)',
};

export type ThemeColors = typeof DarkTheme;
