import type { VideoStreamMerger } from 'video-stream-merger';

const addToMergedStream = (
  mergeObject: VideoStreamMerger,
  streamToBeAdded: MediaStream
) => {
  mergeObject.addStream(streamToBeAdded, undefined);
};

export default addToMergedStream;
