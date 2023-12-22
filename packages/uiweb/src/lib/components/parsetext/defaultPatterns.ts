/**
 * This file contains the default styles for the patters to be used in the application
 */
import type { CustomParseShape } from './customParser.types';

function renderStyles(matchingString: string) {
  // matches => ["[@michel:5455345]", "@michel", "5455345"]
  const pattern = /\[([^:]+):([^\]]+)\]/i;
  const match = matchingString.match(pattern);

  return `${match ? match[2] : ''}`;
}

function newLinestyles(matchingString: string) {
  const pattern = /\\n/g;
  const match = matchingString.match(pattern);
  if (match?.includes('\\n')) {
    const replacedString = matchingString.replace('\\n', '<br/>');
    return `<div>${replacedString}</div>`;
  } else {
    return `<div>${matchingString}</div>`;
  }
}

function renderTextStyles(matchingString: string) {
  const pattern =
    /<span color=["']?(#[0-9A-Fa-f]{3,6}|[a-zA-Z]+)["']?>(.*?)<\/span>/i;
  const match = matchingString.match(pattern);

  if (match) {
    const colorName = match[1].toLowerCase();
    let color;
    switch (colorName) {
      case 'primary':
        color = COLORS.PRIMARY;
        break;
      case 'secondary':
        color = COLORS.GRADIENT_SECONDARY;
        break;
      case 'white':
        color = COLORS.WHITE;
        break;
      // can add more custom color names if needed, couldn't find the tertiary color
      default:
        color = colorName;
    }
    let textContent = match[2];
    if (textContent.includes('\\n')) {
      textContent = match[2].replace('\\n', '<br/>');
    }
    return `<span style="color: ${color}">${textContent}</span>`;
  }

  return matchingString;
}

function renderLinkWithColor(matchingString: string) {
  const pattern =
    /<PUSHText color=["']?(#[0-9A-Fa-f]{3,6}|[a-zA-Z]+)["']?\s+link=["'](https?:\/\/[^"']+)["']>(.*?)<\/PUSHText>/i;
    const linkPattern = /\[([^\]]+)]\((https?:\/\/[^)]+)/;
  const match = matchingString.match(pattern);
  const markdownLinkPattern = matchingString.match(linkPattern);

  if (match) {
    const colorName = match[1].toLowerCase();
    let color;
    // Map custom color names to specific values
    switch (colorName) {
      case 'primary':
        color = COLORS.PRIMARY;
        break;
      case 'secondary':
        color = COLORS.GRADIENT_SECONDARY;
        break;
      case 'tertiary':
        color = COLORS.GRADIENT_THIRD;
        break;
      case 'white':
        color = COLORS.WHITE;
        break;
      // Add more custom color names if needed
      default:
        color = colorName;
    }
    const link = match[2];
    let textContent;
    if (match[3].includes('\\n')) {
      textContent = match[3].replace('\\n', '<br/>');
    } else {
      textContent = match[3];
    }
    return `<a href="${link}" target="_blank" style="color: ${color}">${textContent}</a>`;
  } else if (markdownLinkPattern) {
    const linkText = markdownLinkPattern[1];
    const linkUrl = markdownLinkPattern[2];
    return `<a href="${linkUrl}" target="_blank">${linkText}</a>`;
  }

  return matchingString;
}

function convertEpochToHumanReadable(matchingString: string) {
  const match = matchingString.match(/\[ts: (\d+)\]/);
  if (match) {
    const epochTimestamp = parseInt(match[1], 10); // Extracting the epoch timestamp
    const humanReadableDate = new Date(epochTimestamp * 1000).toLocaleString();
    return humanReadableDate;
  }
  return matchingString;
}

// -------- Define the required colors
const COLORS = {
  PRIMARY: 'rgba(27.0, 150.0, 227.0, 1.0)',

  LINKS: 'rgba(20.0, 126.0, 251.0, 1.0)',

  GRADIENT_PRIMARY: 'rgba(226.0, 8.0, 128.0, 1.0)',
  GRADIENT_SECONDARY: 'rgba(53.0, 197.0, 243.0, 1.0)',
  GRADIENT_THIRD: 'rgba(103.0, 76.0, 159.0, 1.0)',

  TRANSPARENT: 'transparent',

  WHITE: 'rgba(255.0, 255.0, 255.0, 1.0)',
  DARK_WHITE: 'rgba(255.0, 255.0, 255.0, 0.75)',
  MID_WHITE: 'rgba(255.0, 255.0, 255.0, 0.5)',
  LIGHT_WHITE: 'rgba(255.0, 255.0, 255.0, 0.25)',

  SLIGHTER_GRAY: 'rgba(250.0, 250.0, 250.0, 1)',
  SLIGHT_GRAY: 'rgba(231.0, 231.0, 231.0, 1)',
  LIGHT_GRAY: 'rgba(225.0, 225.0, 225.0, 1)',
  MID_GRAY: 'rgba(200.0, 200.0, 200.0, 1)',
  DARK_GRAY: 'rgba(160.0, 160.0, 160.0, 1)',
  DARKER_GRAY: 'rgba(100.0, 100.0, 100.0, 1)',

  LIGHT_BLACK_TRANS: 'rgba(0.0, 0.0, 0.0, 0.1)',
  SEMI_MID_BLACK_TRANS: 'rgba(0.0, 0.0, 0.0, 0.25)',
  MID_BLACK_TRANS: 'rgba(0.0, 0.0, 0.0, 0.5)',
  DARK_BLACK_TRANS: 'rgba(0.0, 0.0, 0.0, 0.75)',
  BLACK: 'rgba(0.0, 0.0, 0.0, 1.0)',

  CONFIRM: 'rgba(34.0, 139.0, 34.0, 1.0)',
  WARNING: 'rgba(255.0, 153.0, 0.0, 1.0)',

  SUBLIME_RED: 'rgba(237.0, 59.0, 72.0, 1.0)',
  BADGE_RED: 'rgba(208.0, 44.0, 30.0, 1.0)',
  LIGHT_MAROON: 'rgba(159.0, 0.0, 0.0, 1.0)',
  LIGHTER_MAROON: 'rgba(129.0, 0.0, 0.0, 1.0)',
};

// -------- Define the default styles for the framework
const styles = {
  // Styling
  container: {},
  name: {
    color: COLORS.SUBLIME_RED,
  },
  username: {
    color: COLORS.GRADIENT_SECONDARY,
  },
  text: {
    color: COLORS.BLACK,
  },
  primary: {
    color: COLORS.GRADIENT_PRIMARY,
  },
  secondary: {
    color: COLORS.GRADIENT_SECONDARY,
  },
  third: {
    color: COLORS.GRADIENT_THIRD,
  },
  error: {
    color: COLORS.SUBLIME_RED,
  },
  white: {
    color: COLORS.WHITE,
  },
  midgray: {
    color: COLORS.MID_GRAY,
  },
  darkgray: {
    color: COLORS.DARK_GRAY,
  },
  darkergray: {
    color: COLORS.DARKER_GRAY,
  },
  link: {
    color: COLORS.GRADIENT_PRIMARY,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  bold: {
    fontWeight: 'bold',
  },
  italics: {
    fontStyle: 'italic',
  },
  pointer: {
    cursor: 'pointer',
  },
};

// -------- Define the default patterns for the framework
const DEFAULT_PATTERNS: CustomParseShape[] = [
  {
    pattern: /\[([^\]]+)]\((https?:\/\/[^)]+)\)/g,
    style: {},
    renderText: renderLinkWithColor,
  },
  {
    pattern: /\[(u):([^\]]+)\]/i, // url
    style: {
      ...styles.primary,
      ...styles.bold,
      ...styles.italics,
      ...styles.underline,
      ...styles.pointer,
    },
    renderText: renderStyles,
  },
  {
    pattern: /\[(ub):([^\]]+)\]/i, // url
    style: {
      ...styles.secondary,
      ...styles.bold,
      ...styles.italics,
      ...styles.underline,
      ...styles.pointer,
    },
    renderText: renderStyles,
  },
  {
    pattern: /\[(ut):([^\]]+)\]/i, // url
    style: {
      ...styles.third,
      ...styles.bold,
      ...styles.italics,
      ...styles.underline,
      ...styles.pointer,
    },
    renderText: renderStyles,
  },
  {
    pattern:
      /<span color=["']?(#[0-9A-Fa-f]{3,6}|[a-zA-Z]+)["']?>(.*?)<\/span>/gi,
    style: {}, // we can add aditional styles here if needed
    renderText: renderTextStyles,
  },
  {
    pattern:
      /<PUSHText color=["']?(#[0-9A-Fa-f]{3,6}|[a-zA-Z]+)["']?\s+link=["'](https?:\/\/[^"']+)["']>(.*?)<\/PUSHText>/gi,
    style: {}, // can Add additional styles here if needed
    renderText: renderLinkWithColor,
  },
  {
    pattern: /\[(up):([^\]]+)\]/i, // url
    style: {
      ...styles.primary,
      ...styles.italics,
      ...styles.underline,
      ...styles.pointer,
    },
    renderText: renderStyles,
  },
  {
    pattern: /\[(d):([^\]]+)\]/i, // default or primary gradient color
    style: {
      ...styles.primary,
      ...styles.bold,
    },
    renderText: renderStyles,
  },
  {
    pattern: /\[(s):([^\]]+)\]/i, // secondary gradient color
    style: {
      ...styles.secondary,
      ...styles.bold,
    },
    renderText: renderStyles,
  },
  {
    pattern: /\[(t):([^\]]+)\]/i, // third gradient color
    style: {
      ...styles.third,
      ...styles.bold,
    },
    renderText: renderStyles,
  },
  {
    pattern: /\[(e):([^\]]+)\]/i, // error
    style: {
      ...styles.error,
      ...styles.bold,
    },
    renderText: renderStyles,
  },
  {
    pattern: /\[(b):([^\]]+)\]/i, // bold
    style: styles.bold,
    renderText: renderStyles,
  },
  {
    pattern: /\*\*\*(.*?)\*\*\*/g, // bold ***text***
    style: {
      ...styles.bold,
      ...styles.italics,
    },
    renderText: (matchingString) =>
      matchingString.replace(/\*\*\*(.*?)\*\*\*/g, '$1'),
  },
  {
    pattern: /\*\*(.*?)\*\*/g, // bold **text**
    style: styles.bold,
    renderText: (matchingString) =>
      matchingString.replace(/\*\*(.*?)\*\*/g, '$1'),
  },
  {
    pattern: /\\n/g,
    style: {},
    renderText: newLinestyles,
  },
  {
    pattern: /\*(.*?)\*/g, // italic *some text*
    style: {
      ...styles.italics,
    },
    renderText: (matchingString) => matchingString.replace(/\*(.*?)\*/g, '$1'),
  },
  {
    pattern: /\[(bi):([^\]]+)\]/i, // bolditalics
    style: {
      ...styles.bold,
      ...styles.italics,
    },
    renderText: renderStyles,
  },
  {
    pattern: /\[ts: (\d+)\]/g, // Match [ts: timestamp_in_epoch]
    style: {},
    renderText: convertEpochToHumanReadable,
  },
  {
    pattern: /\[(w):([^\]]+)\]/i, // white
    style: styles.white,
    renderText: renderStyles,
  },
  {
    pattern: /\[(wb):([^\]]+)\]/i, // whitebold
    style: {
      ...styles.white,
      ...styles.bold,
    },
    renderText: renderStyles,
  },
  {
    pattern: /\[(mg):([^\]]+)\]/i, // midgray
    style: styles.midgray,
    renderText: renderStyles,
  },
  {
    pattern: /\[(dg):([^\]]+)\]/i, // darkgray
    style: styles.darkgray,
    renderText: renderStyles,
  },
  {
    pattern: /\[(ddg):([^\]]+)\]/i, // darker gray
    style: styles.darkergray,
    renderText: renderStyles,
  },
];

export default DEFAULT_PATTERNS;
