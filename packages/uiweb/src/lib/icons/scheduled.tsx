export const Scheduled = ({ color }: { color?: string }) => {
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.25 3.625H3.75C3.40482 3.625 3.125 3.90482 3.125 4.25V16.75C3.125 17.0952 3.40482 17.375 3.75 17.375H16.25C16.5952 17.375 16.875 17.0952 16.875 16.75V4.25C16.875 3.90482 16.5952 3.625 16.25 3.625Z"
        stroke={color ?? '#8B5CF6'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13.75 2.375V4.875"
        stroke={color ?? '#8B5CF6'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.25 2.375V4.875"
        stroke={color ?? '#8B5CF6'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3.125 7.375H16.875"
        stroke={color ?? '#8B5CF6'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
