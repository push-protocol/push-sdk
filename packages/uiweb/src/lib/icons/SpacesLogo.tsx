import React from 'react';

export const SpacesLogo = ({ height, width, color }: { height?: string, width?: string, color?: string }) => {
    return (
        <svg
            width={width || "16"}
            height={height || "16"}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M0 5.6V14.5227C0 15.083 0.668977 15.3728 1.07772 14.9896L4.13843 12.1202C4.22082 12.043 4.32952 12 4.44245 12H10C13.3137 12 16 9.31371 16 6C16 2.68629 13.3137 0 10 0H5.6C2.50721 0 0 2.50721 0 5.6Z"
                fill="white" />
                <g clip-path="url(#clip0_13894_56259)">
                    <path d="M4.48022 5.12109V7.04109" stroke={color ?? "#8B5CF6"} stroke-width="1.28" stroke-linecap="round"
                    stroke-linejoin="round" />
                    <path d="M7.04028 2.56055V9.60055" stroke={color ?? "#8B5CF6"} stroke-width="1.28" stroke-linecap="round"
                    stroke-linejoin="round" />
                    <path d="M9.60034 3.83984L9.60034 8.31984" stroke={color ?? "#8B5CF6"} stroke-width="1.28" stroke-linecap="round"
                    stroke-linejoin="round" />
                    <path d="M12.1602 5.12109L12.1602 7.04109" stroke={color ?? "#8B5CF6"} stroke-width="1.28" stroke-linecap="round"
                    stroke-linejoin="round" />
                </g>
            <defs>
                <clipPath id="clip0_13894_56259">
                    <rect width="14.08" height="14.08" fill="white" transform="translate(0.960449)" />
                </clipPath>
            </defs>
        </svg>
    );
};
