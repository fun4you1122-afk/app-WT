import React from 'react';
import Svg, { Path, Rect, Circle, Line, G } from 'react-native-svg';

interface IconProps { color: string; size: number; focused: boolean; }

export function HomeIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={color + '18'}
      />
    </Svg>
  );
}

export function CommunityIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 14C21 15.1 20.1 16 19 16H13L9 20V8C9 6.9 9.9 6 11 6H19C20.1 6 21 6.9 21 8V14Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={color + '18'}
      />
      <Path
        d="M6 14H4C2.9 14 2 13.1 2 12V5C2 3.9 2.9 3 4 3H13C14.1 3 15 3.9 15 5V6"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function ChatIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 15C21 16.1 20.1 17 19 17H7L3 21V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V15Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={color + '18'}
      />
      <Circle cx="8.5" cy="10" r="1" fill={color} />
      <Circle cx="12" cy="10" r="1" fill={color} />
      <Circle cx="15.5" cy="10" r="1" fill={color} />
    </Svg>
  );
}

export function PortfolioIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="7" width="20" height="14" rx="2" stroke={color} strokeWidth="1.8" fill={color + '18'} />
      <Path
        d="M8 7V5C8 3.9 8.9 3 10 3H14C15.1 3 16 3.9 16 5V7"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <Line x1="2" y1="13" x2="22" y2="13" stroke={color} strokeWidth="1.5" />
    </Svg>
  );
}

export function ProfileIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8" fill={color + '18'} />
      <Path
        d="M4 20C4 17.24 7.58 15 12 15C16.42 15 20 17.24 20 20"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
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

export function AnalyticsIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="12" width="4" height="9" rx="1" stroke={color} strokeWidth="1.8" fill={color + '18'} />
      <Rect x="10" y="7" width="4" height="14" rx="1" stroke={color} strokeWidth="1.8" fill={color + '18'} />
      <Rect x="17" y="3" width="4" height="18" rx="1" stroke={color} strokeWidth="1.8" fill={color + '18'} />
    </Svg>
  );
}

// Open book icon — used for Insights tab
export function BookOpenIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color + '18'}
      />
      <Path
        d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color + '18'}
      />
    </Svg>
  );
}

// Circle with "i" — used for About/Profile tab
export function InfoCircleIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" fill={color + '18'} />
      <Path d="M12 16V12M12 8H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// Consult / phone icon — used for Consult tab
export function ConsultIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.95 13a19.79 19.79 0 01-3.07-8.67A2 2 0 012.86 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color + '18'}
      />
    </Svg>
  );
}
