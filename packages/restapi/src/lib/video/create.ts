export const create = async (): Promise<MediaStream | null> => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
  
      return localStream;
    } catch (err) {
      console.log('Error in creating local stream', err);
      return null;
    }
  };
  