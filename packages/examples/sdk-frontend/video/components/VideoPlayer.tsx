import { useEffect, useRef } from 'react';
import styled from 'styled-components';

type VideoPlayerPropsType = {
  stream: MediaStream | null;
  isMuted: boolean;
};

const VideoPlayer = ({ stream, isMuted }: VideoPlayerPropsType) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [videoRef, stream]);

  return <Video ref={videoRef} muted={isMuted} autoPlay />;
};

const Video = styled.video`
  width: 25vw;
  height: fit-content;
  border: 2px solid black;
`;

export default VideoPlayer;
