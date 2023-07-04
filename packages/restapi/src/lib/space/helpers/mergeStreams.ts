import { VideoStreamMerger } from 'video-stream-merger';

const mergeStreams = (streams: MediaStream[]) => {
  const mergeObject = new VideoStreamMerger();

  // add the audio streams
  streams.forEach((stream) => {
    mergeObject.addStream(stream, undefined);
  });

  mergeObject.start();

  return { mergeObject, result: mergeObject.result };
};

export default mergeStreams;
