import React from 'react';
import Svg, { Polygon, Line, Text as SvgText } from 'react-native-svg';

// Full logo: cube icon + separator + wordmark
export function LogoFull({ width = 320, dark = false }) {
  const height = width * (200 / 680);
  const inventoryColor = dark ? '#9CA3AF' : '#6B7280';
  const wizardColor = dark ? '#C7D2FE' : '#4338CA';

  return (
    <Svg width={width} height={height} viewBox="0 0 680 200">
      {/* Top face */}
      <Polygon points="100,30 148,58 100,86 52,58" fill="#818CF8" />
      {/* Left face */}
      <Polygon points="52,58 100,86 100,142 52,114" fill="#6366F1" />
      {/* Right face */}
      <Polygon points="100,86 148,58 148,114 100,142" fill="#4F46E5" />
      {/* Gold star */}
      <Polygon points="150,22 153,30 161,33 153,36 150,44 147,36 139,33 147,30" fill="#F59E0B" />
      {/* Separator */}
      <Line x1="195" y1="38" x2="195" y2="148" stroke={dark ? '#374151' : '#E5E7EB'} strokeWidth="1.5" />
      {/* "INVENTORY" label */}
      <SvgText
        x="218" y="82"
        fill={inventoryColor}
        fontSize="13"
        fontWeight="400"
        letterSpacing="2"
      >
        INVENTORY
      </SvgText>
      {/* "Wizard" wordmark */}
      <SvgText
        x="214" y="138"
        fill={wizardColor}
        fontSize="46"
        fontWeight="700"
      >
        Wizard
      </SvgText>
    </Svg>
  );
}

// Icon only: just the cube + star (for compact spaces)
export function LogoIcon({ size = 72 }) {
  return (
    <Svg width={size} height={size} viewBox="44 22 122 128">
      <Polygon points="100,30 148,58 100,86 52,58" fill="#818CF8" />
      <Polygon points="52,58 100,86 100,142 52,114" fill="#6366F1" />
      <Polygon points="100,86 148,58 148,114 100,142" fill="#4F46E5" />
      <Polygon points="150,22 153,30 161,33 153,36 150,44 147,36 139,33 147,30" fill="#F59E0B" />
    </Svg>
  );
}
