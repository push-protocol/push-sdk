// Set of icons used in the Push UI
// Colors to pick from
export enum ICON_COLOR {
  PINK = "#D53A94",
}

interface IconProps {
  size: number;
  color: string | ICON_COLOR;
}

// Chat Copy Icon
export const CopyPinkIcon: React.FC<IconProps> = ({ size, color }) => {
  return (
    <svg
      width={size.toString()}
      height={size.toString()}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="copy (1) 1">
        <g id="Group">
          <path
            id="Vector"
            d="M10.6673 8.60004V11.4C10.6673 13.7334 9.73398 14.6667 7.40065 14.6667H4.60065C2.26732 14.6667 1.33398 13.7334 1.33398 11.4V8.60004C1.33398 6.26671 2.26732 5.33337 4.60065 5.33337H7.40065C9.73398 5.33337 10.6673 6.26671 10.6673 8.60004Z"
            fill={color}
          />
          <path
            id="Vector_2"
            d="M11.401 1.33337H8.60102C6.54561 1.33337 5.58165 2.06277 5.38083 3.82605C5.33881 4.19494 5.64433 4.50004 6.0156 4.50004H7.40102C10.201 4.50004 11.501 5.80004 11.501 8.60004V9.98544C11.501 10.3567 11.8061 10.6622 12.175 10.6202C13.9383 10.4194 14.6677 9.45544 14.6677 7.40004V4.60004C14.6677 2.26671 13.7344 1.33337 11.401 1.33337Z"
            fill={color}
          />
        </g>
      </g>
    </svg>
  );
};

// Share Icon
export const SharePinkIcon: React.FC<IconProps> = ({ size, color }) => {
  return (
    <svg
      fill="none"
      height={size.toString()}
      viewBox="0 0 24 24"
      width={size.toString()}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <path d="m12.4856 19.9999-1.2425 1.2425c-1.1283 1.1101-2.64955 1.7294-4.23237 1.7229-1.58283-.0064-3.09898-.638-4.21821-1.7573-1.11924-1.1192-1.75087-2.6354-1.75731-4.2182-.00645-1.5828.61281-3.104 1.7229-4.2324l3.01375-3.00745c1.08102-1.08322 2.53509-1.71243 4.06473-1.7589 1.52961-.04647 3.01921.4933 4.16401 1.5089" />
        <path d="m11.515 4.00061 1.2425-1.2425c1.1283-1.11009 2.6496-1.72935 4.2324-1.7229 1.5828.00644 3.099.63807 4.2182 1.75731 1.1192 1.11923 1.7509 2.63538 1.7573 4.21821.0064 1.58282-.6128 3.10407-1.7229 4.23237l-3.0137 3.0138c-1.0819 1.0823-2.5364 1.7104-4.066 1.7557-1.5297.0453-3.0188-.4956-4.1628-1.512" />
      </g>
    </svg>
  );
};
