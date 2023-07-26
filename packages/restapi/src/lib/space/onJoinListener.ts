import getLiveSpaceData from './helpers/getLiveSpaceData';
import sendLiveSpaceData from './helpers/sendLiveSpaceData';
import { get } from './get';
import { pCAIP10ToWallet } from '../helpers';

import { META_ACTION } from '../types/metaTypes';
import type Space from './Space';

export interface OnJoinListenerType {
  receivedAddress: string;
}

export async function onJoinListener(this: Space, options: OnJoinListenerType) {
  const { receivedAddress } = options || {};

  console.log('JOIN LISTENER CALLED', 'receivedAddress', receivedAddress);

  // method should be called only by the host
  if (
    pCAIP10ToWallet(this.spaceSpecificData.spaceCreator) !==
    this.data.local.address
  ) {
    return;
  }

  // checking the role of the added address
  const updatedSpace = await get({
    spaceId: this.spaceSpecificData.spaceId,
    env: this.env,
  });
  const isAddressListener = updatedSpace.members.find(
    (member) =>
      pCAIP10ToWallet(member.wallet) === pCAIP10ToWallet(receivedAddress) &&
      !member.isSpeaker
  );

  // if the address is not a listner then we dont fire a meta message
  if (!isAddressListener) {
    return;
  }

  // check if the listener is already present in the liveSpaceData
  const fetchedLiveSpaceData = await getLiveSpaceData({
    localAddress: this.data.local.address,
    spaceId: this.spaceSpecificData.spaceId,
    pgpPrivateKey: this.pgpPrivateKey,
    env: this.env,
  });

  const isListenerAlreadyAdded = fetchedLiveSpaceData.listeners.find(
    (currentListener) =>
      pCAIP10ToWallet(currentListener.address) ===
      pCAIP10ToWallet(receivedAddress)
  );

  if (isListenerAlreadyAdded) {
    // listener is already added in the meta message
    // might be case when the listener has left the space
  }

  // adding new listener in the live space data
  fetchedLiveSpaceData.listeners.push({
    address: pCAIP10ToWallet(receivedAddress),
    handRaised: false,
    emojiReactions: null
  })
  // firing a meta message
  await sendLiveSpaceData({
    spaceId: this.spaceSpecificData.spaceId,
    pgpPrivateKey: this.pgpPrivateKey,
    env: this.env,
    signer: this.signer,
    liveSpaceData: fetchedLiveSpaceData,
    action: META_ACTION.ADD_LISTENER,
  });
}
