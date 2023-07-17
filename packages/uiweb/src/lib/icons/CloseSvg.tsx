import React from 'react';

export const CloseSvg = ({ stroke, height, width }: { stroke?: string, height?: string, width?: string }) => {
  return (
    <svg
      width={width || "18.6"}
      height={height || "19"}
      viewBox="0 0 19 19"
      fill='none'
      xmlns="http://www.w3.org/2000/svg"
      cursor="pointer"
    >
      <path
        d="M14.1906 4.15625L3.97363 14.8438"
        stroke={stroke || "#657795"}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14.1906 14.8438L3.97363 4.15625"
        stroke={stroke || "#657795"}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
