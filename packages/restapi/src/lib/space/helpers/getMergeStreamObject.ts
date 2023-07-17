import { VideoStreamMerger } from 'video-stream-merger';

const getMergeStreamObject = (hostStream: MediaStream) => {
  const mergeStreamObject = new VideoStreamMerger();

  // add the audio stream of host
  mergeStreamObject.addStream(hostStream, undefined);

  mergeStreamObject.start();

  return mergeStreamObject;
};

export default getMergeStreamObject;
