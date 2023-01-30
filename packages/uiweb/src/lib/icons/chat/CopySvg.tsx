import React from 'react';

export const CopySvg = ({ stroke,fill }: { stroke?: string, fill?: string }) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill={fill?? "none"} xmlns="http://www.w3.org/2000/svg" cursor="pointer" stroke={stroke}>
    <path d="M17.1865 13.7498V2.81226H6.24902" stroke="#657795" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14.0635 5.9375H3.12598V16.875H14.0635V5.9375Z" stroke="#657795" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>      
  );  
};
