import {
  EnvOptionsType,
  SignerType,
  ChatStatus,
  LiveSpaceData,
} from '../types';
import {
  groupDtoToSpaceDto,
  getSpacesMembersList,
  getSpaceAdminsList,
} from './../chat/helpers';
import { get } from './get';
import { updateGroup } from '../chat/updateGroup';
import getMergeStreamObject from './helpers/getMergeStreamObject';

export interface StartSpaceType extends EnvOptionsType {
  spaceId: string;
  account?: string;
  signer?: SignerType;
  pgpPrivateKey?: string;
}

import type Space from './Space';
import { produce } from 'immer';
import { pCAIP10ToWallet } from '../helpers';
import { CHAT } from '../types/messageTypes';
import sendLiveSpaceData from './helpers/sendLiveSpaceData';

type StartType = {
  livepeerApiKey: string;
};

// export async function start(this: Space, options: StartType): Promise<void> {
export async function start(this: Space): Promise<void> {
  // const { livepeerApiKey } = options || {};

  try {
    // if local media stream is not present then create it
    !this.data.local.stream &&
    (await this.create({ audio: true, video: false }));

    const space = await get({
      spaceId: this.spaceSpecificData.spaceId,
      env: this.env,
    });

    if (space.status !== ChatStatus.PENDING) {
      throw new Error(
        'Unable to start the space as it is not in the pending state'
      );
    }

    // Only host is allowed to start a space
    if (this.data.local.address !== pCAIP10ToWallet(space.spaceCreator)) {
      throw new Error('Only host is allowed to start a space');
    }

    const convertedMembers = getSpacesMembersList(
      space.members,
      space.pendingMembers
    );
    const convertedAdmins = getSpaceAdminsList(
      space.members,
      space.pendingMembers
    );

    const group = await updateGroup({
      chatId: this.spaceSpecificData.spaceId,
      groupName: space.spaceName,
      groupImage: space.spaceImage,
      groupDescription: space.spaceDescription,
      members: convertedMembers,
      admins: convertedAdmins,
      signer: this.signer,
      env: this.env,
      pgpPrivateKey: this.pgpPrivateKey,
      scheduleAt: space.scheduleAt,
      scheduleEnd: space.scheduleEnd,
      status: ChatStatus.ACTIVE,
    });

    const liveSpaceData: LiveSpaceData = {
      host: {
        address: this.data.local.address,
        audio: this.data.local.audio,
        emojiReactions: null,
      },
      coHosts: [],
      speakers: [],
      listeners: [],
    };

    await sendLiveSpaceData({
      liveSpaceData,
      action: CHAT.META.SPACE.CREATE,
      spaceId: this.spaceSpecificData.spaceId,
      signer: this.signer,
      pgpPrivateKey: this.pgpPrivateKey,
      env: this.env,
    });

    // update space data
    this.setSpaceData((oldSpaceData) => {
      return produce(oldSpaceData, (draft) => {
        draft = {
          ...groupDtoToSpaceDto(group),
          liveSpaceData,
          connectionData: draft.connectionData,
        };
        draft.connectionData.meta.broadcast = {
          livepeerInfo: null,
          hostAddress: this.data.local.address,
        };
      });
    });

    // // start the livepeer playback and store the playback URL group meta
    // // send a notification/meta message to all the added listeners (members) telling the space has started

    // // create the mergeStream object
    // const mergedStream = getMergeStreamObject(this.data.local.stream);
    // // store the mergeStreamObject
    // this.mergedStream = mergedStream;

    // const url = 'https://livepeer.studio/api/stream';
    // const data = {
    //   name: this.spaceSpecificData.spaceName,
    //   record: true,
    // };

    // const { data: responseData } = await axios.post(url, data, {
    //   headers: {
    //     Authorization: 'Bearer ' + livepeerApiKey,
    //   },
    // });

    // const { streamKey, playbackId } = responseData;

    // this.update({ meta: playbackId });

    // let redirectUrl;
    // try {

    //   // the redirect URL from the above GET request
    //   await axios.get(`https://livepeer.studio/webrtc/${streamKey}`);
    // } catch (err: any) {
    //   redirectUrl = err.request.responseURL;
    // }

    // // we use the host from the redirect URL in the ICE server configuration
    // const host = new URL(redirectUrl).host;

    // const iceServers = [
    //   {
    //     urls: `stun:${host}`,
    //   },
    //   {
    //     urls: `turn:${host}`,
    //     username: 'livepeer',
    //     credential: 'livepeer',
    //   },
    // ];

    // const peerConnection = new RTCPeerConnection({ iceServers });

    // const newAudioTrack = mergedStream.result?.getAudioTracks?.()?.[0] ?? null;

    // if (newAudioTrack) {
    //   peerConnection?.addTransceiver(newAudioTrack, {
    //     direction: 'sendonly',
    //   });
    // }

    // /**
    //  * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer
    //  * We create an SDP offer here which will be shared with the server
    //  */
    // const offer = await peerConnection.createOffer();
    // /** https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setLocalDescription */
    // await peerConnection.setLocalDescription(offer);

    // /** Wait for ICE gathering to complete */
    // const ofr = await new Promise<RTCSessionDescription | null>((resolve) => {
    //   /** Wait at most five seconds for ICE gathering. */
    //   setTimeout(() => {
    //     resolve(peerConnection.localDescription);
    //   }, 5000);
    //   peerConnection.onicegatheringstatechange = (_ev) => {
    //     if (peerConnection.iceGatheringState === 'complete') {
    //       resolve(peerConnection.localDescription);
    //     }
    //   };
    // });
    // if (!ofr) {
    //   throw Error('failed to gather ICE candidates for offer');
    // }
    // /**
    //  * This response contains the server's SDP offer.
    //  * This specifies how the client should communicate,
    //  * and what kind of media client and server have negotiated to exchange.
    //  */
    // const sdpResponse = await fetch(redirectUrl, {
    //   method: 'POST',
    //   mode: 'cors',
    //   headers: {
    //     'content-type': 'application/sdp',
    //   },
    //   body: ofr.sdp,
    // });
    // if (sdpResponse.ok) {
    //   const answerSDP = await sdpResponse.text();
    //   await peerConnection.setRemoteDescription(
    //     new RTCSessionDescription({ type: 'answer', sdp: answerSDP })
    //   );
    // }
  } catch (err) {
    console.error(`[Push SDK] - API  - Error - API ${start.name} -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API ${start.name} -: ${err}`);
  }
}
