import React from 'react';

export const useFeedScroll = <T>(
  dep: T,
): React.MutableRefObject<HTMLDivElement | null> => {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = 0;
    }
  }, []);
  return ref;
};