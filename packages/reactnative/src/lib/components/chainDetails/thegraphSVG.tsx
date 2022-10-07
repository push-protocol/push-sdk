// @ts-nocheck
import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"

const GraphSvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="10 10 72 72"
    style={{
      enableBackground: "new 0 0 96 96",
    }}
    xmlSpace="preserve"
    {...props}
  >
    <Circle
      cx={48}
      cy={48}
      r={48}
      style={{
        fill: "transparent",
      }}
    />
    <Path
      d="M135.3 106.2c-7.1 0-12.8-5.7-12.8-12.8 0-7.1 5.7-12.8 12.8-12.8 7.1 0 12.8 5.7 12.8 12.8 0 7.1-5.7 12.8-12.8 12.8m0-32c10.6 0 19.2 8.6 19.2 19.2s-8.6 19.2-19.2 19.2-19.2-8.6-19.2-19.2 8.6-19.2 19.2-19.2zm18.3 39.4c1.3 1.3 1.3 3.3 0 4.5l-12.8 12.8c-1.3 1.3-3.3 1.3-4.5 0-1.3-1.3-1.3-3.3 0-4.5l12.8-12.8c1.2-1.3 3.3-1.3 4.5 0zm7.4-36.2c0 1.8-1.4 3.2-3.2 3.2-1.8 0-3.2-1.4-3.2-3.2s1.4-3.2 3.2-3.2c1.7 0 3.2 1.4 3.2 3.2z"
      style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        fill: "#6747ed",
      }}
      transform="translate(-88 -52)"
    />
  </Svg>
)

export default GraphSvgComponent
