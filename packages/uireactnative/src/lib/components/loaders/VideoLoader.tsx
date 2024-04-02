import { AppState, StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MediaHelper } from '../../helpers';
import YoutubeIframe, {
  PLAYER_STATES,
  type YoutubeIframeRef,
} from 'react-native-youtube-iframe';
import { ResizeMode, Video } from 'expo-av';

interface VideoLoaderProps {
  videoUri: string;
}

export const VideoLoader = ({ videoUri }: VideoLoaderProps) => {
  const videoRef = useRef<Video>(null);
  const youtubeRef = useRef<YoutubeIframeRef>(null);

  const [ytPlaying, setYtPlaying] = useState(false);

  const onStateChange = useCallback((state: PLAYER_STATES) => {
    if (state === 'ended') setYtPlaying(false);
  }, []);

  const stopVideo = () => {
    setYtPlaying(false);
    videoRef.current?.stopAsync();
  };

  useEffect(() => {
    if (AppState.currentState !== 'active') stopVideo();

    return () => stopVideo();
  }, []);

  if (MediaHelper.isMediaExternalEmbed(videoUri)) {
    return (
      <YoutubeIframe
        ref={youtubeRef}
        height={200}
        play={ytPlaying}
        onChangeState={onStateChange}
        videoId={MediaHelper.getYoutubeID(videoUri)}
      />
    );
  }

  return (
    <Video
      source={{
        uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
      }}
      ref={videoRef}
      useNativeControls
      resizeMode={ResizeMode.COVER}
      isLooping
      style={styles.video}
    />
  );
};

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: 200,
  },
});
