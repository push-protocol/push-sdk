export type EndOptionsType = {
  peerInstanceRef: any;
};

export const end = (options: EndOptionsType): void => {
  const { peerInstanceRef } = options || {};
  peerInstanceRef.current.destroy();
};
