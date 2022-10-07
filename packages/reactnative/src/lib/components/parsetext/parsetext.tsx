// @ts-nocheck
// TODO: fixTS
import * as React from 'react';
import { StyleSheet, View, Linking, Platform } from 'react-native';
import ParsedText from 'react-native-parsed-text';

import GLOBALS from '../../globals';


export function ParseText(props: any) {
  const {
    style,
    title,
    fontSize,
    textStyle,
  } = props;

  const handleUrlPress = (matchingString: string, matchIndex:number/*: number*/) => {
    const pattern = /\[([^:]+):([^\]]+)\]/i;
    const match = matchingString.match(pattern) || [];

    const midComponent = `${match[2]}`;
    const url = midComponent.substr(midComponent.indexOf('||') + 2);

    Linking.openURL(url);
  };

  const handleAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    }
  };

  const renderStyles = (matchingString: string, matches: string[]) => {
    // matches => ["[@michel:5455345]", "@michel", "5455345"]
    const pattern = /\[([^:]+):([^\]]+)\]/i;
    const match = matchingString.match(pattern) || [];

    return `${match[2]}`;
  };

  const renderThreeStyles = (matchingString: string, matches: string[]) => {
    // matches => ["[@michel:5455345]", "@michel", "5455345"]
    const pattern = /\[([^:]+):([^\]]+)\]/i;
    const match = matchingString.match(pattern) || [];

    const midComponent = `${match[2]}`;
    const midText = midComponent.substr(0, midComponent.indexOf('||'));
    return midText;
  };

  const TextUpdatedStyle = {
    fontSize: fontSize
  }

  const parseSettings = [
    {
      pattern: /\[(u):([^\]]+)\]/i, // url
      style: [styles.primary, styles.bold, styles.italics, styles.underline],
      onPress: handleUrlPress,
      renderText: renderThreeStyles
    },
    {
      pattern: /\[(ub):([^\]]+)\]/i, // url
      style: [styles.secondary, styles.bold, styles.italics, styles.underline],
      onPress: handleUrlPress,
      renderText: renderThreeStyles
    },
    {
      pattern: /\[(ut):([^\]]+)\]/i, // url
      style: [styles.third, styles.bold, styles.italics, styles.underline],
      onPress: handleUrlPress,
      renderText: renderThreeStyles
    },
    {
      pattern: /\[(up):([^\]]+)\]/i, // url
      style: [styles.primary, styles.italics, styles.underline],
      onPress: handleUrlPress,
      renderText: renderThreeStyles
    },
    {
      pattern: /\[(d):([^\]]+)\]/i, // default or primary gradient color
      style: [styles.primary, styles.bold],
      renderText: renderStyles
    },
    {
      pattern: /\[(s):([^\]]+)\]/i, // secondary gradient color
      style: [styles.secondary, styles.bold],
      renderText: renderStyles
    },
    {
      pattern: /\[(t):([^\]]+)\]/i, // third gradient color
      style: [styles.third, styles.bold],
      renderText: renderStyles
    },
    {
      pattern: /\[(e):([^\]]+)\]/i, // error
      style: [styles.error, styles.bold],
      renderText: renderStyles
    },
    {
      pattern: /\[(b):([^\]]+)\]/i, // bold
      style: styles.bold,
      renderText: renderStyles
    },
    {
      pattern: /\[(i):([^\]]+)\]/i, // italics
      style: styles.italics,
      renderText: renderStyles
    },
    {
      pattern: /\[(bi):([^\]]+)\]/i, // bolditalics
      style: [styles.bold, styles.italics],
      renderText: renderStyles
    },
    {
      pattern: /\[(w):([^\]]+)\]/i, // white
      style: [styles.white],
      renderText: renderStyles
    },
    {
      pattern: /\[(wb):([^\]]+)\]/i, // whitebold
      style: [styles.white, styles.bold],
      renderText: renderStyles
    },
    {
      pattern: /\[(mg):([^\]]+)\]/i, // midgray
      style: [styles.midgray],
      renderText: renderStyles
    },
    {
      pattern: /\[(dg):([^\]]+)\]/i, // darkgray
      style: [styles.darkgray],
      renderText: renderStyles
    },
    {
      pattern: /\[(ddg):([^\]]+)\]/i, // darker gray
      style: [styles.darkergray],
      renderText: renderStyles
    },
  ];

  if (Platform.OS === 'ios') {
    parseSettings.push(
      {
        pattern: /\[(appsettings):([^\]]+)\]/i,
        style: [styles.link, styles.bold, styles.italics, styles.underline],
        onPress: handleAppSettings,
        renderText: renderStyles
      }
    );
  }
  else if (Platform.OS === 'android') {
    parseSettings.push(
      {
        pattern: /\[(appsettings):([^\]]+)\]/i,
        style: [styles.bold],
        renderText: renderStyles
      }
    );
  }

  return (
    <View style = {[ styles.container, style ]}>
      <ParsedText
        style = {[ styles.text, TextUpdatedStyle, textStyle ]}
        parse = {parseSettings}
        childrenProps={{allowFontScaling: false}}
      >
        {title}
      </ParsedText>
    </View>
  );

}


// Styling
const styles = StyleSheet.create({
  container: {
  },
  name: {
    color: GLOBALS.COLORS.SUBLIME_RED
  },
  username: {
    color: GLOBALS.COLORS.GRADIENT_SECONDARY
  },
  text: {
    color: GLOBALS.COLORS.BLACK
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
    fontWeight: 'bold'
  },
  italics: {
    fontStyle: 'italic'
  }
});