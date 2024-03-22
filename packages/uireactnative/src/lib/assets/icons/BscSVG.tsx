import * as React from 'react';
import Svg, { type SvgProps, Circle, Path } from 'react-native-svg';

export const BscSVG = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Circle cx={12} cy={12} r={12} fill="#1D1D1D" />
    <Path
      fill="#F0B90B"
      d="m8.162 12-1.58 1.579L5.001 12l1.579-1.579L8.162 12ZM12 8.162l2.709 2.708 1.579-1.579L12 5 7.709 9.291l1.579 1.58L12 8.16Zm5.417 2.259L15.838 12l1.579 1.579L18.996 12l-1.579-1.579ZM12 15.838 9.291 13.13l-1.579 1.579L12 19l4.288-4.291-1.58-1.58L12 15.84Zm0-2.259L13.579 12 12 10.421 10.417 12 12 13.579Z"
    />
  </Svg>
);
