import * as React from 'react';
import Svg, { type SvgProps, Path } from 'react-native-svg';

export const EthereumSVG = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill="#627EEA"
      d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Z"
    />
    <Path
      fill="#fff"
      fillOpacity={0.602}
      d="M12.373 3v6.652l5.623 2.513L12.374 3Z"
    />
    <Path fill="#fff" d="M12.373 3 6.75 12.165l5.623-2.512V3Z" />
    <Path
      fill="#fff"
      fillOpacity={0.602}
      d="M12.373 16.476v4.52L18 13.212l-5.627 3.264Z"
    />
    <Path fill="#fff" d="M12.373 20.996v-4.52L6.75 13.211l5.623 7.784Z" />
    <Path
      fill="#fff"
      fillOpacity={0.2}
      d="m12.373 15.43 5.623-3.265-5.622-2.51v5.775Z"
    />
    <Path
      fill="#fff"
      fillOpacity={0.602}
      d="m6.75 12.165 5.623 3.265V9.654L6.75 12.165Z"
    />
  </Svg>
);
