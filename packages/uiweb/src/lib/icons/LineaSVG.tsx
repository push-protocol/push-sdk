import * as React from "react"
import { SVGProps } from "react"

const LineaSVG = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={25}
    viewBox="0 0 24 24"
    {...props}
  >
    <defs>
      <clipPath id="a">
        <path d="M5.965 7H16v11H5.965Zm0 0" />
      </clipPath>
      <clipPath id="b">
        <path d="M13 6h4.91v4H13Zm0 0" />
      </clipPath>
    </defs>
    <g clipPath="url(#a)">
      <path
        style={{
          stroke: "none",
          fillRule: "nonzero",
          fill: "#121212",
          fillOpacity: 1,
        }}
        d="M15.883 18H5.965V7.95h2.27v8.1h7.648Zm0 0"
      />
    </g>
    <g clipPath="url(#b)">
      <path
        style={{
          stroke: "none",
          fillRule: "nonzero",
          fill: "#121212",
          fillOpacity: 1,
        }}
        d="M15.883 9.895c1.12 0 2.027-.872 2.027-1.946C17.91 6.875 17.004 6 15.883 6c-1.117 0-2.024.875-2.024 1.95 0 1.073.907 1.945 2.024 1.945Zm0 0"
      />
    </g>
  </svg>
)
export default LineaSVG
