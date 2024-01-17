import * as React from 'react';
import Svg, { type SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';

export const GraphSVG = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <G clipPath="url(#a)">
      <Path
        fill="#6747ED"
        d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Z"
      />
      <Path
        fill="#fff"
        fillRule="evenodd"
        d="M11.66 12.768A3.098 3.098 0 0 1 8.555 9.66a3.098 3.098 0 0 1 3.107-3.107 3.098 3.098 0 0 1 3.107 3.107 3.098 3.098 0 0 1-3.107 3.107Zm0-7.768a4.662 4.662 0 0 1 0 9.321 4.662 4.662 0 0 1 0-9.321Zm4.443 9.564c.315.316.315.801 0 1.092l-3.107 3.107c-.316.316-.801.316-1.093 0-.315-.315-.315-.8 0-1.092l3.107-3.107a.749.749 0 0 1 1.093 0Zm1.796-8.787c0 .437-.34.777-.777.777a.767.767 0 0 1-.776-.777c0-.437.34-.777.776-.777.413 0 .777.34.777.777Z"
        clipRule="evenodd"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
