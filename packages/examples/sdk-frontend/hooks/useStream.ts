import { useEffect, useState } from 'react';
import { CONSTANTS, VideoEvent } from '@pushprotocol/restapi';

export const useStream = ({ streamObject }: any) => {
  const [stream, setStream] = useState<any>();
  const [latestFeedItem, setLatestFeedItem] = useState<any>(null);
  const [isPushSocketConnected, setIsPushSocketConnected] = useState(false);

  const addSocketEvents = () => {
    console.log(stream);
    stream?.on(CONSTANTS.STREAM.CONNECT, () => {
      console.log('CONNECTED: ');
      setIsPushSocketConnected(true);
    });
    stream?.on(CONSTANTS.STREAM.DISCONNECT, () => {
      console.log('DISCONNECT: ');
      setIsPushSocketConnected(false);
    });

    stream?.on(CONSTANTS.STREAM.VIDEO, (data: VideoEvent) => {
      console.log('RECEIVED FEED ITEM: ', data);
      setLatestFeedItem(data);
    });
  };

  const removeSocketEvents = () => {
    stream?.off(CONSTANTS.STREAM.CONNECT);
    stream?.off(CONSTANTS.STREAM.DISCONNECT);
    stream?.off(CONSTANTS.STREAM.VIDEO);
  };

  useEffect(() => {
    if (stream) {
      addSocketEvents();
      stream.connect();
    }

    return () => {
      if (stream) {
        removeSocketEvents();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream]);

  // Update stream state when streamObject changes
  useEffect(() => {
    if (!streamObject) return;
    setStream(streamObject);
  }, [streamObject]);

  return {
    stream,
    isPushSocketConnected,
    latestFeedItem,
  };
};
