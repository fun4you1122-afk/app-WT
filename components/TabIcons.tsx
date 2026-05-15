import React from 'react';
import Svg, { Path, Rect, G, Circle, Polyline, Line } from 'react-native-svg';

interface IconProps { color: string; size: number; focused: boolean; }

export function HomeIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill={color + '18'} />
    </Svg>
  );
}

export function ServicesIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="8" height="8" rx="2" stroke={color} strokeWidth="1.8" fill={color + '18'} />
      <Rect x="13" y="3" width="8" height="8" rx="2" stroke={color} strokeWidth="1.8" fill={color + '18'} />
      <Rect x="3" y="13" width="8" height="8" rx="2" stroke={color} strokeWidth="1.8" fill={color + '18'} />
      <Rect x="13" y="13" width="8" height="8" rx="2" stroke={color} strokeWidth="1.8" fill={color + '18'} />
    </Svg>
  );
}

export function PortfolioIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="7" width="20" height="14" rx="2" stroke={color} strokeWidth="1.8" fill={color + '18'} />
      <Path d="M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="2" y1="13" x2="22" y2="13" stroke={color} strokeWidth="1.8" />
    </Svg>
  );
}

export function AnalyticsIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="12" width="4" height="9" rx="1" stroke={color} strokeWidth="1.8" fill={color + '18'} />
      <Rect x="10" y="7" width="4" height="14" rx="1" stroke={color} strokeWidth="1.8" fill={color + '18'} />
      <Rect x="17" y="3" width="4" height="18" rx="1" stroke={color} strokeWidth="1.8" fill={color + '18'} />
    </Svg>
  );
}

export function ChatIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill={color + '18'} />
    </Svg>
  );
}
