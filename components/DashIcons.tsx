import React from 'react';
import Svg, { Path, Rect, Circle, Line, Polyline } from 'react-native-svg';

interface P { color?: string; size?: number; }

export function BellIcon({ color = '#333', size = 24 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function CalendarIcon({ color = '#fff', size = 26 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="17" rx="2" stroke={color} strokeWidth="1.8" fill={color + '25'} />
      <Path d="M3 9h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M8 4V2M16 4V2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Rect x="7" y="13" width="3" height="3" rx="0.5" fill={color} />
    </Svg>
  );
}

export function BotIcon({ color = '#fff', size = 26 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="8" width="18" height="12" rx="3" stroke={color} strokeWidth="1.8" fill={color + '25'} />
      <Circle cx="9" cy="14" r="1.8" fill={color} />
      <Circle cx="15" cy="14" r="1.8" fill={color} />
      <Path d="M12 8V5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Circle cx="12" cy="4" r="1.5" fill={color} />
      <Path d="M3 14H1M23 14h-2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function ServicesGridIcon({ color = '#fff', size = 26 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="7.5" height="7.5" rx="1.5" stroke={color} strokeWidth="1.8" fill={color + '25'} />
      <Rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" stroke={color} strokeWidth="1.8" fill={color + '25'} />
      <Rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" stroke={color} strokeWidth="1.8" fill={color + '25'} />
      <Rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" stroke={color} strokeWidth="1.8" fill={color + '25'} />
    </Svg>
  );
}

export function AnalyticsLineIcon({ color = '#fff', size = 26 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polyline points="3,17 8,12 12,15 17,9 21,11" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M17 9l4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M21 5v4h-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="3" y1="20" x2="21" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity={0.5} />
    </Svg>
  );
}
