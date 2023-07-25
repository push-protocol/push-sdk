import { pCAIP10ToWallet } from '../helpers';
import getLiveSpaceData from './helpers/getLiveSpaceData';
import getSpaceListeners from './helpers/getSpaceListeners';
import sendLiveSpaceData from './helpers/sendLiveSpaceData';

import { ListenerPeer, SpaceDTO } from '../types';
import { META_ACTION } from '../types/metaTypes';
import type Space from './Space';

export interface OnJoinListenerType {
  receivedSpaceData: SpaceDTO;
}

export async function onJoinListener(this: Space, options: OnJoinListenerType) {
  const { receivedSpaceData } = options || {};

  if (
    pCAIP10ToWallet(this.spaceSpecificData.spaceCreator) !==
    this.data.local.address
  ) {
    return;
  }

  // check whether any new listener has joined by comparing this.spaceSpecificData and receivedLiveSpaceData
  const fetchedLiveSpaceData = await getLiveSpaceData({
    localAddress: this.data.local.address,
    spaceId: this.spaceSpecificData.spaceId,
    pgpPrivateKey: this.pgpPrivateKey,
    env: this.env,
  });
  const localListeners = fetchedLiveSpaceData.listeners;
  const receivedListeners = getSpaceListeners(receivedSpaceData.members);

  const localListenerAddresses: {
    [key: string]: number;
  } = {};
  localListeners.map((listener, index) => {
    localListenerAddresses[pCAIP10ToWallet(listener.address)] = index;
  });

  const updatedListeners: ListenerPeer[] = [];

  let areListenersChanged = false;

  for (const listener of receivedListeners) {
    const index = localListenerAddresses[pCAIP10ToWallet(listener.wallet)];

    if (!areListenersChanged) areListenersChanged = Boolean(!index);

    updatedListeners.push(
      index
        ? localListeners[index]
        : {
            address: listener.wallet,
            handRaised: false,
            emojiReactions: null,
          }
    );
  }

  console.log('LIVESPACEDATA OUTSIDE', {
    ...fetchedLiveSpaceData,
    listeners: updatedListeners,
  });

  if (areListenersChanged) {
    sendLiveSpaceData({
      spaceId: this.spaceSpecificData.spaceId,
      pgpPrivateKey: this.pgpPrivateKey,
      env: this.env,
      signer: this.signer,
      liveSpaceData: { ...fetchedLiveSpaceData, listeners: updatedListeners },
      action: META_ACTION.ADD_LISTENER,
    });
  }
}
