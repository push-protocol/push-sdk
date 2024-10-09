// Set of icons used in the Push UI
// DEFAULT COLOR
enum ICON_COLOR {
  DEFAULT = '#787E99',
}

// HELPERS
interface IconProps {
  size: number | { width?: number; height?: number } | string | undefined | null;
  color?: string | ICON_COLOR;
}

const returnWSize = (size: number | { width?: number; height?: number } | string | undefined | null) => {
  if (typeof size === 'string') {
    size = parseInt(size);
  }

  if (typeof size === 'undefined' || size === null) {
    return '100%';
  }

  return typeof size === 'number' ? size.toString() : size.width ? size.width.toString() : '100%';
};

const returnHSize = (size: number | { width?: number; height?: number } | string | undefined | null) => {
  if (typeof size === 'string') {
    size = parseInt(size);
  }

  if (typeof size === 'undefined' || size === null) {
    return '100%';
  }

  return typeof size === 'number' ? size.toString() : size.height ? size.height.toString() : '100%';
};

const returnViewBox = (size: number | { width?: number; height?: number } | string | undefined | null, ratio = 1) => {
  if (typeof size === 'string') {
    size = parseInt(size);
  }

  if (typeof size === 'undefined' || size === null) {
    size = 20; // default viewport size
  }

  if (typeof size === 'number') {
    return `0 0 ${size * ratio} ${size * ratio}`;
  } else if (size.width && size.height) {
    return `0 0 ${size.width * ratio} ${size.height * ratio}`;
  } else if (size.width) {
    return `0 0 ${size.width * ratio} ${size.width * ratio}`;
  } else if (size.height) {
    return `0 0 ${size.height * ratio} ${size.height * ratio}`;
  } else {
    return `0 0 20 20`; // default
  }
};

// ICONS
// ------
// CATEGORY - CHAT PROFILE COMPONENT
// ------
// Copy Icon
export const CopyIcon: React.FC<IconProps> = ({ size, color = ICON_COLOR.DEFAULT }) => {
  return (
    <svg
      width={returnWSize(size)}
      height={returnHSize(size)}
      viewBox={returnViewBox(size)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="copy (1) 1">
        <g id="Group">
          <path
            fill={color}
            id="Vector"
            d="M10.6673 8.60004V11.4C10.6673 13.7334 9.73398 14.6667 7.40065 14.6667H4.60065C2.26732 14.6667 1.33398 13.7334 1.33398 11.4V8.60004C1.33398 6.26671 2.26732 5.33337 4.60065 5.33337H7.40065C9.73398 5.33337 10.6673 6.26671 10.6673 8.60004Z"
          />
          <path
            fill={color}
            id="Vector_2"
            d="M11.401 1.33337H8.60102C6.54561 1.33337 5.58165 2.06277 5.38083 3.82605C5.33881 4.19494 5.64433 4.50004 6.0156 4.50004H7.40102C10.201 4.50004 11.501 5.80004 11.501 8.60004V9.98544C11.501 10.3567 11.8061 10.6622 12.175 10.6202C13.9383 10.4194 14.6677 9.45544 14.6677 7.40004V4.60004C14.6677 2.26671 13.7344 1.33337 11.401 1.33337Z"
          />
        </g>
      </g>
    </svg>
  );
};

// Token Gated Icon
export const TokenGatedIcon: React.FC<IconProps> = ({ size, color }) => {
  return (
    <svg
      width={returnWSize(size)}
      height={returnHSize(size)}
      viewBox={returnViewBox(20)}
      fill={'none'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={color}
        d="M9.75 0.25C7.82164 0.25 5.93657 0.821828 4.33319 1.89317C2.72982 2.96452 1.48013 4.48726 0.742179 6.26884C0.00422448 8.05042 -0.188858 10.0108 0.187348 11.9021C0.563554 13.7934 1.49215 15.5307 2.85571 16.8943C4.21927 18.2579 5.95656 19.1865 7.84787 19.5627C9.73919 19.9389 11.6996 19.7458 13.4812 19.0078C15.2627 18.2699 16.7855 17.0202 17.8568 15.4168C18.9282 13.8134 19.5 11.9284 19.5 10C19.4973 7.41498 18.4692 4.93661 16.6413 3.10872C14.8134 1.28084 12.335 0.25273 9.75 0.25ZM15.7613 12.7319C15.9318 12.8343 16.0547 13.0003 16.1029 13.1934C16.1511 13.3864 16.1206 13.5907 16.0181 13.7612C15.9157 13.9318 15.7497 14.0547 15.5566 14.1029C15.3636 14.1511 15.1593 14.1206 14.9888 14.0181L10.5 11.3247V16.1875C10.5 16.3864 10.421 16.5772 10.2803 16.7178C10.1397 16.8585 9.94892 16.9375 9.75 16.9375C9.55109 16.9375 9.36033 16.8585 9.21967 16.7178C9.07902 16.5772 9 16.3864 9 16.1875V11.3247L4.51125 14.0181C4.34069 14.1206 4.13641 14.1511 3.94337 14.1029C3.75032 14.0547 3.58432 13.9318 3.48188 13.7612C3.37944 13.5907 3.34895 13.3864 3.39713 13.1934C3.4453 13.0003 3.56819 12.8343 3.73875 12.7319L8.29219 10L3.73875 7.26813C3.56819 7.16569 3.4453 6.99968 3.39713 6.80664C3.34895 6.61359 3.37944 6.40932 3.48188 6.23875C3.58432 6.06818 3.75032 5.9453 3.94337 5.89712C4.13641 5.84895 4.34069 5.87944 4.51125 5.98187L9 8.67531V3.8125C9 3.61359 9.07902 3.42282 9.21967 3.28217C9.36033 3.14152 9.55109 3.0625 9.75 3.0625C9.94892 3.0625 10.1397 3.14152 10.2803 3.28217C10.421 3.42282 10.5 3.61359 10.5 3.8125V8.67531L14.9888 5.98187C15.0732 5.93115 15.1668 5.89756 15.2643 5.88302C15.3617 5.86848 15.4611 5.87327 15.5566 5.89712C15.6522 5.92098 15.7422 5.96342 15.8214 6.02204C15.9005 6.08065 15.9674 6.15429 16.0181 6.23875C16.0689 6.32321 16.1024 6.41683 16.117 6.51427C16.1315 6.6117 16.1267 6.71105 16.1029 6.80664C16.079 6.90222 16.0366 6.99218 15.978 7.07136C15.9193 7.15054 15.8457 7.2174 15.7613 7.26813L11.2078 10L15.7613 12.7319Z"
      />
    </svg>
  );
};

// Public Chat Icon
export const PublicChatIcon: React.FC<IconProps> = ({ size, color }) => {
  return (
    <svg
      width={returnWSize(size)}
      height={returnHSize(size)}
      viewBox={returnViewBox(30)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={color}
        d="M30.9137 15.595C30.87 15.4963 29.8112 13.1475 27.4575 10.7937C24.3212 7.6575 20.36 6 16 6C11.64 6 7.67874 7.6575 4.54249 10.7937C2.18874 13.1475 1.12499 15.5 1.08624 15.595C1.02938 15.7229 1 15.8613 1 16.0012C1 16.1412 1.02938 16.2796 1.08624 16.4075C1.12999 16.5062 2.18874 18.8538 4.54249 21.2075C7.67874 24.3425 11.64 26 16 26C20.36 26 24.3212 24.3425 27.4575 21.2075C29.8112 18.8538 30.87 16.5062 30.9137 16.4075C30.9706 16.2796 31 16.1412 31 16.0012C31 15.8613 30.9706 15.7229 30.9137 15.595ZM16 24C12.1525 24 8.79124 22.6012 6.00874 19.8438C4.86704 18.7084 3.89572 17.4137 3.12499 16C3.89551 14.5862 4.86686 13.2915 6.00874 12.1562C8.79124 9.39875 12.1525 8 16 8C19.8475 8 23.2087 9.39875 25.9912 12.1562C27.1352 13.2912 28.1086 14.5859 28.8812 16C27.98 17.6825 24.0537 24 16 24ZM16 10C14.8133 10 13.6533 10.3519 12.6666 11.0112C11.6799 11.6705 10.9108 12.6075 10.4567 13.7039C10.0026 14.8003 9.88377 16.0067 10.1153 17.1705C10.3468 18.3344 10.9182 19.4035 11.7573 20.2426C12.5965 21.0818 13.6656 21.6532 14.8294 21.8847C15.9933 22.1162 17.1997 21.9974 18.2961 21.5433C19.3924 21.0892 20.3295 20.3201 20.9888 19.3334C21.6481 18.3467 22 17.1867 22 16C21.9983 14.4092 21.3657 12.884 20.2408 11.7592C19.1159 10.6343 17.5908 10.0017 16 10ZM16 20C15.2089 20 14.4355 19.7654 13.7777 19.3259C13.1199 18.8864 12.6072 18.2616 12.3045 17.5307C12.0017 16.7998 11.9225 15.9956 12.0768 15.2196C12.2312 14.4437 12.6122 13.731 13.1716 13.1716C13.731 12.6122 14.4437 12.2312 15.2196 12.0769C15.9956 11.9225 16.7998 12.0017 17.5307 12.3045C18.2616 12.6072 18.8863 13.1199 19.3259 13.7777C19.7654 14.4355 20 15.2089 20 16C20 17.0609 19.5786 18.0783 18.8284 18.8284C18.0783 19.5786 17.0609 20 16 20Z"
      />
    </svg>
  );
};

// ------
// CATEGORY - CHAT VIEW LIST
// ------

// ------
// CATEGORY - MISC
// ------
// Share Icon
export const ShareIcon: React.FC<IconProps> = ({ size, color }) => {
  return (
    <svg
      width={returnWSize(size)}
      height={returnHSize(size)}
      viewBox={returnViewBox(16)}
      fill="none"
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

// Accept Icon
export const AcceptCircleIcon: React.FC<IconProps> = ({ size, color }) => {
  return (
    <svg
      width={returnWSize(size)}
      height={returnHSize(size)}
      viewBox={returnViewBox(40)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 0.5C16.1433 0.5 12.3731 1.64366 9.16639 3.78634C5.95963 5.92903 3.46027 8.97451 1.98436 12.5377C0.508449 16.1008 0.122284 20.0216 0.874696 23.8043C1.62711 27.5869 3.4843 31.0615 6.21143 33.7886C8.93855 36.5157 12.4131 38.3729 16.1957 39.1253C19.9784 39.8777 23.8992 39.4916 27.4623 38.0156C31.0255 36.5397 34.071 34.0404 36.2137 30.8336C38.3564 27.6269 39.5 23.8567 39.5 20C39.4901 14.8313 37.4325 9.87718 33.7776 6.22237C30.1228 2.56755 25.1687 0.509911 20 0.5ZM29.2813 16.5875L18.2938 27.0875C18.0097 27.3547 17.6337 27.5024 17.2438 27.5C17.0531 27.5027 16.8639 27.4677 16.6869 27.3969C16.5099 27.3261 16.3487 27.2209 16.2125 27.0875L10.7188 21.8375C10.5664 21.7046 10.4425 21.5422 10.3544 21.3601C10.2664 21.1781 10.2161 20.9801 10.2066 20.7781C10.197 20.5761 10.2284 20.3743 10.2988 20.1847C10.3693 19.9952 10.4773 19.8218 10.6164 19.6751C10.7556 19.5283 10.923 19.4113 11.1085 19.3309C11.2941 19.2505 11.494 19.2084 11.6962 19.2072C11.8984 19.2061 12.0988 19.2458 12.2852 19.324C12.4717 19.4023 12.6404 19.5174 12.7813 19.6625L17.2438 23.9187L27.2188 14.4125C27.5104 14.158 27.8891 14.0262 28.2758 14.0445C28.6624 14.0628 29.027 14.2298 29.2933 14.5107C29.5597 14.7915 29.7071 15.1644 29.7049 15.5515C29.7026 15.9386 29.5508 16.3098 29.2813 16.5875Z"
        fill={color}
      />
    </svg>
  );
};

// Cancel Icon
export const CancelCircleIcon: React.FC<IconProps> = ({ size, color }) => {
  return (
    <svg
      width={returnWSize(size)}
      height={returnHSize(size)}
      viewBox={returnViewBox(38)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 37C28.9411 37 37 28.9411 37 19C37 9.05887 28.9411 1 19 1C9.05887 1 1 9.05887 1 19C1 28.9411 9.05887 37 19 37Z"
        stroke={color}
        stroke-width="2"
        stroke-miterlimit="10"
      />

      <path
        d="M25 13L13 25"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M25 25L13 13"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

// ------
// CATEGORY - REACTION & EMOJI
// ------
// Emoji Icon
export const EmojiCircleIcon: React.FC<IconProps> = ({ size, color }) => {
  return (
    <svg
      width={returnWSize(size)}
      height={returnHSize(size)}
      viewBox={returnViewBox(24)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.04746 10.9393C8.77509 10.9393 9.36494 10.3494 9.36494 9.6218C9.36494 8.89418 8.77509 8.30432 8.04746 8.30432C7.31984 8.30432 6.72998 8.89418 6.72998 9.6218C6.72998 10.3494 7.31984 10.9393 8.04746 10.9393Z"
        fill={color}
      />
      <path
        d="M15.9525 10.9393C16.6801 10.9393 17.27 10.3494 17.27 9.6218C17.27 8.89418 16.6801 8.30432 15.9525 8.30432C15.2249 8.30432 14.635 8.89418 14.635 9.6218C14.635 10.3494 15.2249 10.9393 15.9525 10.9393Z"
        fill={color}
      />
      <path
        d="M16.3916 14.4525C15.4803 16.028 13.951 17.0875 12 17.0875C10.049 17.0875 8.51966 16.028 7.6084 14.4525"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

// Reply Icon
export const ReplyIcon: React.FC<IconProps> = ({ size, color }) => {
  return (
    <svg
      width={returnWSize(size)}
      height={returnHSize(size)}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <rect
        width="48"
        height="48"
        fill="none"
      />
      <g
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      >
        <path d="M12.364 8L6 14.364 12.364 20.728" />
        <path d="M6 14.364H28.672c6.885 0 12.54 5.439 12.808 12.318.284 7.27-5.533 13.318-12.808 13.318H12" />
      </g>
    </svg>
  );
};
