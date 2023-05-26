export const restartVideoStream = (stream: MediaStream): void => {
  console.log('RESTART LOCAL STREAM');
  const vidTracks = stream.getVideoTracks();
  vidTracks.forEach((track) => (track.enabled = true));
};

export const stopVideoStream = (stream: MediaStream): void => {
  console.log('STOP LOCAL STREAM');
  const vidTracks = stream.getVideoTracks();
  vidTracks.forEach((track) => (track.enabled = false));
};

export const restartAudioStream = (stream: MediaStream): void => {
  console.log('RESTART AUDIO');
  const audTracks = stream.getAudioTracks();
  audTracks.forEach((track) => (track.enabled = true));
};

export const stopAudioStream = (stream: MediaStream): void => {
  console.log('STOP AUDIO');
  const audTracks = stream.getAudioTracks();
  audTracks.forEach((track) => (track.enabled = false));
};

export const endStream = (stream: MediaStream) => {
  console.log("END STREAM");
  stream.getTracks().forEach((track) => track.stop());
}
