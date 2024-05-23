import React from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { GLOBALS } from '../../constants';

interface StylishLabelProps {
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  title: string;
  fontSize: number;
}

export const StylishLabel = ({
  style,
  title,
  fontSize,
  textStyle,
}: StylishLabelProps) => {
  const openLink = (url: string | undefined) => {
    if (!url) return;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) Linking.openURL(url);
      else console.log("Don't know how to open URI: " + url);
    });
  };

  const handleUrlPress = (matchingString: string) => {
    let pattern = /\[([^:]+):([^\]]+)\]/i;
    let match = matchingString.match(pattern);

    if (match && match[2]) {
      const midComponent = `${match[2]}`;
      const url = midComponent.substr(midComponent.indexOf('||') + 2);
      openLink(url);
    }
  };

  const handlePhonePress = (phone: string) => {
    if (Platform.OS !== 'android') {
      phone = `telprompt:${phone}`;
    } else {
      phone = `tel:${phone}`;
    }
    openLink(phone);
  };

  const handleEmailPress = (email: string) => {
    openLink(`mailto:${email}`);
  };

  const handleAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    }
  };

  const renderStyles = (matchingString: string) => {
    let pattern = /\[([^:]+):([^\]]+)\]/i;
    let match = matchingString.match(pattern);

    if (match && match[2]) return `${match[2]}`;
    return '';
  };

  const renderThreeStyles = (matchingString: string) => {
    // matches => ["[@michel:5455345]", "@michel", "5455345"]
    let pattern = /\[([^:]+):([^\]]+)\]/i;
    let match = matchingString.match(pattern);

    if (match && match[2]) {
      let midComponent = `${match[2]}`;
      const midText = midComponent.substr(0, midComponent.indexOf('||'));
      return midText;
    } else {
      return '';
    }
  };

  const handleAnchorRender = (matchingString: string) => {
    let renderString = matchingString;
    renderString = renderString.replace(/<a[^>]*>/, '');
    renderString = renderString.replace('</a>', '');
    return renderString;
  };

  const handelAnchorClick = (matchingString: string) => {
    let url = matchingString;
    const match = url.match(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/);
    if (match) url = match[0];
    url = url.replace('<a href=', '');
    url = url.replace(/"/g, '');
    url = url.replace(/'/g, '');

    Linking.openURL(url);
  };

  const newLineStyles = () => {
    return '\n';
  };

  const renderTextStyles = (matchingString: string) => {
    const pattern =
      /<span color=["']?(#[0-9A-Fa-f]{3,6}|[a-zA-Z]+)["']?>(.*?)<\/span>/i;
    const match = matchingString.match(pattern);

    if (match && match[1]) {
      const colorName = match[1].toLowerCase();
      let color;
      switch (colorName) {
        case 'primary':
          color = GLOBALS.COLORS.PRIMARY;
          break;
        case 'secondary':
          color = GLOBALS.COLORS.GRADIENT_SECONDARY;
          break;
        case 'white':
          color = GLOBALS.COLORS.WHITE;
          break;
        default:
          color = colorName;
      }
      let textContent = match[2];
      return <Text style={{ color: color }}>{textContent}</Text>;
    }

    return matchingString;
  };

  const renderLinkWithColor = (matchingString: string) => {
    const pattern =
      /<PUSHText color=["']?(#[0-9A-Fa-f]{3,6}|[a-zA-Z]+)["']?\s+link=["'](https?:\/\/[^"']+)["']>(.*?)<\/PUSHText>/i;
    const linkPattern = /\[([^\]]+)]\((https?:\/\/[^)]+)/;
    const match = matchingString.match(pattern);
    const markdownLinkPattern = matchingString.match(linkPattern);

    if (match && match[1]) {
      const colorName = match[1].toLowerCase();
      let color;
      // Map custom color names to specific values
      switch (colorName) {
        case 'primary':
          color = GLOBALS.COLORS.PRIMARY;
          break;
        case 'secondary':
          color = GLOBALS.COLORS.GRADIENT_SECONDARY;
          break;
        case 'tertiary':
          color = GLOBALS.COLORS.GRADIENT_THIRD;
          break;
        case 'white':
          color = GLOBALS.COLORS.WHITE;
          break;
        // Add more custom color names if needed
        default:
          color = colorName;
      }

      const link = match[2];
      let textContent = match[3];
      return (
        <Text style={{ color: color }} onPress={() => openLink(link)}>
          {textContent}
        </Text>
      );
    } else if (markdownLinkPattern) {
      const linkText = markdownLinkPattern[1];
      const linkUrl = markdownLinkPattern[2];
      return (
        <Text onPress={() => openLink(linkUrl)} style={styles.linkText}>
          {linkText}
        </Text>
      );
    }

    return matchingString;
  };

  let TextUpdatedStyle = {
    fontSize: fontSize,
  };

  let parseSettings = [
    {
      type: 'email',
      style: [styles.link, styles.underline],
      onPress: handleEmailPress,
    },
    {
      type: 'phone',
      style: [styles.link, styles.underline],
      onPress: handlePhonePress,
    },
    {
      pattern: /\[([^\]]+)]\((https?:\/\/[^)]+)\)/g,
      style: {},
      renderText: renderLinkWithColor,
    },
    {
      pattern: /\[(u):([^\]]+)\]/i, // url
      style: [styles.primary, styles.bold, styles.italics, styles.underline],
      onPress: handleUrlPress,
      renderText: renderThreeStyles,
    },
    {
      pattern: /\[(ub):([^\]]+)\]/i, // urli
      style: [styles.secondary, styles.bold, styles.italics, styles.underline],
      onPress: handleUrlPress,
      renderText: renderThreeStyles,
    },
    {
      pattern: /\[(ut):([^\]]+)\]/i, // url
      style: [styles.third, styles.bold, styles.italics, styles.underline],
      onPress: handleUrlPress,
      renderText: renderThreeStyles,
    },
    {
      pattern: /<a[^>]*>([^<]+)<\/a>/, // for anchor tage
      style: [styles.third, styles.bold, styles.italics, styles.underline],
      onPress: handelAnchorClick,
      renderText: handleAnchorRender,
    },
    {
      pattern: /\[(up):([^\]]+)\]/i, // url
      style: [styles.primary, styles.italics, styles.underline],
      onPress: handleUrlPress,
      renderText: renderThreeStyles,
    },
    {
      pattern:
        /<span color=["']?(#[0-9A-Fa-f]{3,6}|[a-zA-Z]+)["']?>(.*?)<\/span>/gi,
      style: {}, // we can add aditional styles here if needed
      renderText: renderTextStyles,
    },
    {
      pattern: /\[(d):([^\]]+)\]/i, // default or primary gradient color
      style: [styles.primary, styles.bold],
      renderText: renderStyles,
    },
    {
      pattern: /\[(s):([^\]]+)\]/i, // secondary gradient color
      style: [styles.secondary, styles.bold],
      renderText: renderStyles,
    },
    {
      pattern: /\[(t):([^\]]+)\]/i, // third gradient color
      style: [styles.third, styles.bold],
      renderText: renderStyles,
    },
    {
      pattern: /\[(e):([^\]]+)\]/i, // error
      style: [styles.error, styles.bold],
      renderText: renderStyles,
    },
    {
      pattern: /\[(bi):([^\]]+)\]/i, // bolditalics
      style: [styles.bold, styles.italics],
      renderText: renderStyles,
    },
    {
      pattern: /\*\*\*(.*?)\*\*\*/g, // bolditalics ***text***
      style: {
        ...styles.bold,
        ...styles.italics,
      },
      renderText: (matchingString: string) =>
        matchingString.replace(/\*\*\*(.*?)\*\*\*/g, '$1'),
    },
    {
      pattern: /\[(b):([^\]]+)\]/i, // bold
      style: styles.bold,
      renderText: renderStyles,
    },
    {
      pattern: /\*\*(.*?)\*\*/g, // bold **text**
      style: styles.bold,
      renderText: (matchingString: string) =>
        matchingString.replace(/\*\*(.*?)\*\*/g, '$1'),
    },
    {
      pattern: /\[(i):([^\]]+)\]/i, // italics
      style: styles.italics,
      renderText: renderStyles,
    },
    {
      pattern: /\*(.*?)\*/g, // italic *some text*
      style: {
        ...styles.italics,
      },
      renderText: (matchingString: string) =>
        matchingString.replace(/\*(.*?)\*/g, '$1'),
    },
    {
      pattern: /\[(w):([^\]]+)\]/i, // white
      style: [styles.white],
      renderText: renderStyles,
    },
    {
      pattern: /\[(wb):([^\]]+)\]/i, // whitebold
      style: [styles.white, styles.bold],
      renderText: renderStyles,
    },
    {
      pattern: /\[(mg):([^\]]+)\]/i, // midgray
      style: [styles.midgray],
      renderText: renderStyles,
    },
    {
      pattern: /\[(dg):([^\]]+)\]/i, // darkgray
      style: [styles.darkgray],
      renderText: renderStyles,
    },
    {
      pattern: /\[(ddg):([^\]]+)\]/i, // darker gray
      style: [styles.darkergray],
      renderText: renderStyles,
    },
    {
      type: 'url',
      style: [styles.link, styles.underline],
      onPress: handleUrlPress,
    },
    {
      pattern: /\\n/g,
      style: {},
      renderText: newLineStyles,
    },
  ];

  if (Platform.OS === 'ios') {
    parseSettings.push({
      pattern: /\[(appsettings):([^\]]+)\]/i,
      style: [styles.link, styles.bold, styles.italics, styles.underline],
      onPress: handleAppSettings,
      renderText: renderStyles,
    });
  } else if (Platform.OS === 'android') {
    parseSettings.push({
      pattern: /\[(appsettings):([^\]]+)\]/i,
      style: [styles.bold],
      renderText: renderStyles,
    });
  }

  return (
    <View style={[styles.container, style]}>
      <ParsedText
        style={[styles.text, TextUpdatedStyle, textStyle]}
        // @ts-ignore
        parse={parseSettings}
        childrenProps={{ allowFontScaling: false }}
      >
        {title}
      </ParsedText>
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {},
  name: {
    color: GLOBALS.COLORS.SUBLIME_RED,
  },
  username: {
    color: GLOBALS.COLORS.GRADIENT_SECONDARY,
  },
  text: {
    color: GLOBALS.COLORS.BLACK,
  },
  primary: {
    color: GLOBALS.COLORS.GRADIENT_PRIMARY,
  },
  secondary: {
    color: GLOBALS.COLORS.GRADIENT_SECONDARY,
  },
  third: {
    color: GLOBALS.COLORS.GRADIENT_THIRD,
  },
  error: {
    color: GLOBALS.COLORS.SUBLIME_RED,
  },
  white: {
    color: GLOBALS.COLORS.WHITE,
  },
  midgray: {
    color: GLOBALS.COLORS.MID_GRAY,
  },
  darkgray: {
    color: GLOBALS.COLORS.DARK_GRAY,
  },
  darkergray: {
    color: GLOBALS.COLORS.DARKER_GRAY,
  },
  link: {
    color: GLOBALS.COLORS.GRADIENT_PRIMARY,
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
  linkText: {
    color: GLOBALS.COLORS.PINK,
    flex: 0,
  },
});
