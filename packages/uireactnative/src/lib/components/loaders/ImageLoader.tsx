import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { GLOBALS } from '../../constants';

interface ImageLoaderProps {
  imageUri: string;
}

export const ImageLoader = ({ imageUri }: ImageLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const onLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Image {...{ onLoadEnd }} source={{ uri: imageUri }} style={styles.img} />
      <ActivityIndicator
        style={styles.activity}
        animating={isLoading}
        size={'large'}
        color={GLOBALS.COLORS.PINK}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  img: {
    borderColor: GLOBALS.COLORS.SLIGHT_GRAY,
    backgroundColor: GLOBALS.COLORS.SLIGHTER_GRAY,
    borderBottomWidth: 1,
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
});
