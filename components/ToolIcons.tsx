import React from 'react';
import Svg, { Path, Rect, Circle, Line, Polyline, G, Ellipse } from 'react-native-svg';

interface P { color?: string; size?: number; }

export function BotIcon({ color = '#fff', size = 28 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="8" width="18" height="12" rx="3" stroke={color} strokeWidth="1.8" fill={color + '20'} />
      <Circle cx="9" cy="14" r="2" fill={color} />
      <Circle cx="15" cy="14" r="2" fill={color} />
      <Path d="M9 20v2M15 20v2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M12 8V4M9 4h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Circle cx="12" cy="4" r="1.5" fill={color} />
      <Path d="M3 14H1M23 14h-2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function QuizIcon({ color = '#fff', size = 28 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="2" width="18" height="20" rx="2" stroke={color} strokeWidth="1.8" fill={color + '20'} />
      <Path d="M8 7h8M8 11h8M8 15h5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Circle cx="17" cy="17" r="3.5" fill={color} />
      <Path d="M15.5 17l1 1 2-2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CostIcon({ color = '#fff', size = 28 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" fill={color + '20'} />
      <Path d="M12 6v1.5M12 16.5V18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M9 9.5C9 8.12 10.34 7 12 7s3 1.12 3 2.5c0 1.67-1.5 2.5-3 2.5s-3 .83-3 2.5C9 15.88 10.34 17 12 17s3-1.12 3-2.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function ROIIcon({ color = '#fff', size = 28 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 17l5-5 4 3 5-6 4 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M17 8h4v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Rect x="2" y="19" width="20" height="2" rx="1" fill={color + '40'} />
    </Svg>
  );
}

export function CalendarIcon({ color = '#fff', size = 28 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="17" rx="2" stroke={color} strokeWidth="1.8" fill={color + '20'} />
      <Path d="M3 9h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M8 4V2M16 4V2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Rect x="7" y="13" width="3" height="3" rx="0.5" fill={color} />
      <Rect x="14" y="13" width="3" height="3" rx="0.5" fill={color + '60'} />
    </Svg>
  );
}

export function NewsIcon({ color = '#fff', size = 28 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="1.8" fill={color + '20'} />
      <Rect x="6" y="7" width="12" height="3" rx="0.5" fill={color} />
      <Path d="M6 13h12M6 16h8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function BookIcon({ color = '#fff', size = 28 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 3h14a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2z" stroke={color} strokeWidth="1.8" fill={color + '20'} />
      <Path d="M8 3v18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M11 8h5M11 12h5M11 16h3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function KeyIcon({ color = '#fff', size = 28 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="8.5" cy="11" r="5" stroke={color} strokeWidth="1.8" fill={color + '20'} />
      <Path d="M13 11h7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M18 11v3M20 11v2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function GaugeIcon({ color = '#fff', size = 28 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5.64 5.64A9 9 0 1018.36 18.36" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <Path d="M12 3a9 9 0 019 9" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <Path d="M12 12l-3.5-3.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="12" cy="12" r="1.5" fill={color} />
    </Svg>
  );
}

export function ShieldIcon({ color = '#fff', size = 28 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L4 6v6c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V6L12 2z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill={color + '20'} />
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function BoardIcon({ color = '#fff', size = 28 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="4" width="6" height="16" rx="1.5" stroke={color} strokeWidth="1.8" fill={color + '20'} />
      <Rect x="10" y="4" width="6" height="10" rx="1.5" stroke={color} strokeWidth="1.8" fill={color + '20'} />
      <Rect x="18" y="4" width="4" height="7" rx="1.5" stroke={color} strokeWidth="1.8" fill={color + '20'} />
    </Svg>
  );
}

export function HeadsetIcon({ color = '#fff', size = 28 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 11a9 9 0 0118 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <Path d="M3 11v3a2 2 0 002 2h1a2 2 0 002-2v-2a2 2 0 00-2-2H3z" stroke={color} strokeWidth="1.8" fill={color + '20'} />
      <Path d="M21 11v3a2 2 0 01-2 2h-1a2 2 0 01-2-2v-2a2 2 0 012-2h3z" stroke={color} strokeWidth="1.8" fill={color + '20'} />
      <Path d="M19 16v1a3 3 0 01-3 3h-3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}
