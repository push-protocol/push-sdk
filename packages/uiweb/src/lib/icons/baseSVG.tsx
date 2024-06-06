import * as React from "react"
import { SVGProps } from "react"

export const BaseSVG = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <path
      style={{
        stroke: "none",
        fillRule: "nonzero",
        fill: "#0052ff",
        fillOpacity: 1,
      }}
      d="M11.875 23.793c6.582 0 11.918-5.328 11.918-11.898C23.793 5.325 18.457 0 11.875 0 5.633 0 .508 4.793 0 10.895h15.75v2H0c.508 6.101 5.633 10.898 11.875 10.898Zm0 0"
    />
  </svg>
)

