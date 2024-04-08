import * as React from 'react';
import Svg, { type SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';

export const PolygonSVG = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <G clipPath="url(#a)">
      <Path
        fill="#7B3FE4"
        d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Z"
      />
      <Path
        fill="#fff"
        d="M20 12.28v3.62a1.308 1.308 0 0 1-.64 1.117l-3.125 1.806a1.246 1.246 0 0 1-1.28 0l-3.125-1.806a1.304 1.304 0 0 1-.64-1.117v-1.016l1.6-.932v1.766l2.8 1.631 2.8-1.63v-3.255l-2.8-1.63-6.56 3.813a1.3 1.3 0 0 1-1.28 0l-3.125-1.814A1.303 1.303 0 0 1 4 11.718v-3.62a1.308 1.308 0 0 1 .64-1.117l3.125-1.806a1.258 1.258 0 0 1 1.28 0l3.125 1.806a1.303 1.303 0 0 1 .64 1.117v1.016l-1.61.926V8.284L8.4 6.653l-2.8 1.63v3.25l2.8 1.631 6.56-3.813a1.3 1.3 0 0 1 1.28 0l3.125 1.814A1.302 1.302 0 0 1 20 12.28Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
