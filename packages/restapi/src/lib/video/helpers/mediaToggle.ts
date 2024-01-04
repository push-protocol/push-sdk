export const restartVideoStream = (stream: MediaStream): void => {
  const vidTracks = stream.getVideoTracks();
  vidTracks.forEach((track) => (track.enabled = true));
};

export const stopVideoStream = (stream: MediaStream): void => {
  const vidTracks = stream.getVideoTracks();
  vidTracks.forEach((track) => (track.enabled = false));
};

export const restartAudioStream = (stream: MediaStream): void => {
  const audTracks = stream.getAudioTracks();
  audTracks.forEach((track) => (track.enabled = true));
};

export const stopAudioStream = (stream: MediaStream): void => {
  const audTracks = stream.getAudioTracks();
  audTracks.forEach((track) => (track.enabled = false));
};

export const endStream = (stream: MediaStream) => {
  stream.getTracks().forEach((track) => track.stop());
}
