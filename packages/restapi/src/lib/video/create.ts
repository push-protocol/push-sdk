export const create = async (): Promise<MediaStream | null> => {
    console.log('INITIALIZE LOCAL STREAM');
  
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
  
      // TODO: Add RN logic
  
      return localStream;
    } catch (err) {
      console.log('Error in creating local stream', err);
      return null;
    }
  };
  