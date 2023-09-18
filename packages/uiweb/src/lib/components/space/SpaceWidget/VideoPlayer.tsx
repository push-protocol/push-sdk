import { IMediaStream } from '@pushprotocol/restapi';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

export interface IVideoPlayerProps {
  videoCallData: IMediaStream;
}

export const VideoPlayer: React.FC<IVideoPlayerProps> = ({ videoCallData }) => {
  const incomingVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!incomingVideoRef?.current) return;
    const video = incomingVideoRef.current;
    video.srcObject = videoCallData;
    video.play();
  }, [incomingVideoRef?.current, videoCallData]);

  return <Video ref={incomingVideoRef}></Video>;
};

const Video = styled.video`
  height: 0;
  width: 0;
`;
