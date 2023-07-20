const getSpaceListeners = (
  members: {
    wallet: string;
    publicKey: string;
    isSpeaker: boolean;
    image: string;
  }[]
) => {
  const listeners: {
    wallet: string;
    publicKey: string;
    isSpeaker: boolean;
    image: string;
  }[] = [];

  members.forEach((member) => {
    if (!member.isSpeaker) {
      listeners.push(member);
    }
  });

  return listeners;
};

export default getSpaceListeners;
