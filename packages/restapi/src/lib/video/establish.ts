export type EstablishOptionsType = {
  signalData: any;
  peerInstanceRef: any;
};

export const establish = (options: EstablishOptionsType): void => {
  const { signalData, peerInstanceRef } = options || {};

  peerInstanceRef.current.signal(signalData);
};
