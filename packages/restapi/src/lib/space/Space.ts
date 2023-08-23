import { produce } from 'immer';

import Constants from '../constants';
import { Video, initVideoCallData } from '../video';
import { update } from './update';
import { start } from './start';
import { inviteToPromote } from './inviteToPromote';
import { acceptPromotionInvite } from './acceptPromotionInvite';
import { connectInvitee } from './connectInvitee';
import { rejectPromotionInvite } from './rejectPromotionInvite';
import { requestToBePromoted } from './requestToBePromoted';
import { acceptPromotionRequest } from './acceptPromotionRequest';
import { rejectPromotionRequest } from './rejectPromotionRequest';
import { connectPromotor } from './connectPromotor';
import { join } from './join';
import { leave } from './leave';
import { stop } from './stop';
import { initialize } from './initialize';
import addToMergedStream from './helpers/addToMergedStream';

import { VideoStreamMerger } from 'video-stream-merger';
import {
  ChatStatus,
  EnvOptionsType,
  LiveSpaceData,
  SignerType,
  SpaceData,
  SpaceSpecificData,
} from '../types';
import { VIDEO_CALL_TYPE } from '../payloads/constants';
import getLiveSpaceData from './helpers/getLiveSpaceData';
import sendLiveSpaceData from './helpers/sendLiveSpaceData';
import { META_ACTION } from '../types/messageObjectTypes';
import { broadcastRaisedHand } from './broadcastRaisedHand';
import { onReceiveMetaMessage } from './onReceiveMetaMessage';
import { onJoinListener } from './onJoinListener';
import { pCAIP10ToWallet } from '../helpers';

export const initLiveSpaceData: LiveSpaceData = {
  host: {
    address: '',
    audio: null,
    emojiReactions: null,
  },
  coHosts: [],
  speakers: [],
  listeners: [],
};

export const initSpaceSpecificData: SpaceSpecificData = {
  members: [],
  pendingMembers: [],
  contractAddressERC20: null,
  numberOfERC20: -1,
  contractAddressNFT: null,
  numberOfNFTTokens: -1,
  verificationProof: '',
  spaceImage: null,
  spaceName: '',
  isPublic: false,
  spaceDescription: '',
  spaceCreator: '',
  spaceId: '',
  scheduleAt: null,
  scheduleEnd: null,
  status: null,
  inviteeDetails: {},
  liveSpaceData: initLiveSpaceData,
};

export const initSpaceData: SpaceData = {
  ...initSpaceSpecificData,
  connectionData: initVideoCallData,
};

export interface SpaceConstructorType extends EnvOptionsType {
  signer: SignerType;
  pgpPrivateKey: string;
  chainId: number;
  address: string;
  setSpaceData: (fn: (data: SpaceData) => SpaceData) => void;
}

// declaring the Space class
export class Space extends Video {
  protected mergedStream: VideoStreamMerger | null = null;

  protected spaceSpecificData: SpaceSpecificData;
  protected setSpaceSpecificData: (
    fn: (data: SpaceSpecificData) => SpaceSpecificData
  ) => void;

  // will be exposed and should be used from outside the class to change state
  setSpaceData: (fn: (data: SpaceData) => SpaceData) => void;

  constructor(options: SpaceConstructorType) {
    const {
      signer,
      pgpPrivateKey,
      address,
      chainId,
      env = Constants.ENV.PROD,
      setSpaceData, // to update the 'spaceData' state maintained by the developer
    } = options || {};

    // init the Video class
    super({
      signer,
      chainId,
      pgpPrivateKey,
      env,
      callType: VIDEO_CALL_TYPE.PUSH_SPACE,
      onReceiveStream: async (
        receivedStream: MediaStream,
        senderAddress: string,
        audio: boolean | null
      ) => {
        // for a space, that has started broadcast & the local peer is the host
        if (
          this.spaceSpecificData.status === ChatStatus.ACTIVE &&
          this.data.meta.broadcast?.hostAddress &&
          this.data.meta.broadcast.hostAddress === this.data.local.address
        ) {
          addToMergedStream(this.mergedStream!, receivedStream);

          // update live space info
          const oldLiveSpaceData = await getLiveSpaceData({
            localAddress: this.data.local.address,
            pgpPrivateKey: this.pgpPrivateKey,
            env: this.env,
            spaceId: this.spaceSpecificData.spaceId,
          });
          const updatedLiveSpaceData = produce(oldLiveSpaceData, (draft) => {
            // check if the address was a listener
            const listenerIndex = draft.listeners.findIndex(
              (listener) => listener.address === senderAddress
            );

            // TODO: Create distinction between speakers and co hosts
            draft.speakers.push({
              address: senderAddress,
              audio,
              emojiReactions:
                listenerIndex > -1
                  ? draft.listeners[listenerIndex].emojiReactions
                  : null,
            });

            if (listenerIndex > -1) draft.listeners.splice(listenerIndex, 1);
          });
          await sendLiveSpaceData({
            liveSpaceData: updatedLiveSpaceData,
            pgpPrivateKey: this.pgpPrivateKey,
            env: this.env,
            spaceId: this.spaceSpecificData.spaceId,
            signer: this.signer,
            action: META_ACTION.PROMOTE_TO_SPEAKER, // TODO: Add a meta action for SPEAKER_JOINED
          });
          this.setSpaceSpecificData(() => ({
            ...this.spaceSpecificData,
            liveSpaceData: updatedLiveSpaceData,
          }));
        }
      },
      onDisconnect: async ({
        peerAddress
      }: {
        peerAddress: string
      }) => {
        // for a space, that has started broadcast & the local peer is the host
        if (
          this.spaceSpecificData.status === ChatStatus.ACTIVE &&
          this.data.meta.broadcast?.hostAddress &&
          this.data.meta.broadcast.hostAddress === this.data.local.address
        ) {

          // update live space info
          const oldLiveSpaceData = await getLiveSpaceData({
            localAddress: this.data.local.address,
            pgpPrivateKey: this.pgpPrivateKey,
            env: this.env,
            spaceId: this.spaceSpecificData.spaceId,
          });
          const updatedLiveSpaceData = produce(oldLiveSpaceData, (draft) => {
            // check if the address was a listener
            const speakerIndex = draft.speakers.findIndex(
              (speaker) => speaker.address === peerAddress
            );

            if (speakerIndex > -1) draft.speakers.splice(speakerIndex, 1);
          });
          await sendLiveSpaceData({
            liveSpaceData: updatedLiveSpaceData,
            pgpPrivateKey: this.pgpPrivateKey,
            env: this.env,
            spaceId: this.spaceSpecificData.spaceId,
            signer: this.signer,
            action: META_ACTION.REMOVE_SPEAKER
          });
          this.setSpaceSpecificData(() => ({
            ...this.spaceSpecificData,
            liveSpaceData: updatedLiveSpaceData,
          }));
        }
      },
      setData: function () {
        return;
      }, // setData will be overridden below
    });

    // setting state changing functions

    /*
      - Will be used internally in the class
      - Overriding setData (Video)
      - To be used when we only want to modify video call 'data'
    */
    this.setData = function (fn) {
      const newVideoData = fn(this.data);

      // update the react state
      setSpaceData(() => ({
        ...this.spaceSpecificData,
        connectionData: newVideoData,
      }));

      // update the video class variable
      this.data = newVideoData;
    };

    /*
      - Will be used internally in the class
      - To be used when we only want to modify space specific 'data'
    */
    this.setSpaceSpecificData = function (fn) {
      const newSpaceSpecificData = fn(this.spaceSpecificData);

      // update the react state
      setSpaceData(() => ({
        ...newSpaceSpecificData,
        connectionData: this.data,
      }));

      // update the video class variable
      this.spaceSpecificData = newSpaceSpecificData;
    };

    // set the space state updating function
    this.setSpaceData = function (fn) {
      const { connectionData: newConnectionData, ...newSpaceSpecificData } = fn(
        {
          ...this.spaceSpecificData,
          connectionData: this.data,
        }
      );

      // update the space specific data
      this.spaceSpecificData = newSpaceSpecificData;

      // update the video data and update the external state
      this.setData(() => newConnectionData);
    };

    // initializing state

    // set the local address inside video call 'data'
    this.setData((oldVideoCallData) => {
      return produce(oldVideoCallData, (draft) => {
        draft.local.address = pCAIP10ToWallet(address);
      });
    });

    // init the state maintained by the developer
    setSpaceData(() => initSpaceData);

    // init the spaceSpecificData class variable
    this.spaceSpecificData = initSpaceSpecificData;
  }

  // adding instance methods

  public initialize = initialize;

  public update = update;

  public createAudioStream = async () => {
    await this.create({ audio: true, video: false });
  };

  public start = start;

  public onReceiveMetaMessage = onReceiveMetaMessage;

  // host will call this function from socket
  // will fire a meta message if a new listener has joined the space
  public onJoinListener = onJoinListener;

  // to promote a listener to a speaker/co-host
  public inviteToPromote = inviteToPromote;
  public acceptPromotionInvite = acceptPromotionInvite;
  public connectInvitee = connectInvitee;
  public rejectPromotionInvite = rejectPromotionInvite;

  // listener requests to be promoted to a speaker
  public requestToBePromoted = requestToBePromoted;
  public broadcastRaisedHand = broadcastRaisedHand; // will be called by the host after receiving the request to be promoted
  public acceptPromotionRequest = acceptPromotionRequest;
  public connectPromotor = connectPromotor;
  public rejectPromotionRequest = rejectPromotionRequest;

  /*
    - add/remove co-host to the space group as admins
    - add/remove them from the meta message
    - these methods are only to be used when the space hasnt started yet
  */
  // public addCoHost = addCoHost;
  // public removeCoHost = removeCoHost;

  // add listner to the space group as member
  public join = join;

  public leave = leave;
  public stop = stop;
}

export default Space;
