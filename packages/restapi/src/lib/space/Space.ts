import { produce } from 'immer';

import { Video, initVideoCallData } from '../video';
import { create as createSpace } from './create';
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
import { addSpeaker } from './addSpeaker';
import { removeSpeaker } from './removeSpeaker';
import { join } from './join';
import { leave } from './leave';
import { stop } from './stop';

import { EnvOptionsType, SignerType, SpaceDTO, SpaceData } from '../types';
import { VIDEO_CALL_TYPE } from '../payloads/constants';
import Constants from '../constants';

const initSpaceSpecificData = {
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
};

export const initSpaceData = {
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
class Space extends Video {
  protected spaceSpecificData: SpaceDTO;
  protected setSpaceSpecificData: (fn: (data: SpaceDTO) => SpaceDTO) => void;

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
      setData: function () {
        return;
      }, // setData will be overridden below
    });

    // init the state maintained by the developer
    setSpaceData(() => initSpaceData);

    // init the spaceSpecificData class variable
    this.spaceSpecificData = initSpaceSpecificData;

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

    // set the local address inside video call 'data'
    this.setData((oldVideoCallData) => {
      return produce(oldVideoCallData, (draft) => {
        draft.local.address = address;
      });
    });

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
  }

  // adding instance methods

  public initialize = createSpace;

  public update = update;

  public createAudioStream = async () => {
    await this.create({ audio: true, video: false });
  };

  public start = start;

  // to promote a listener to a speaker/co-host
  public inviteToPromote = inviteToPromote;
  public acceptPromotionInvite = acceptPromotionInvite;
  public connectInvitee = connectInvitee;
  public rejectPromotionInvite = rejectPromotionInvite;

  // listener requests to be promoted to a speaker
  public requestToBePromoted = requestToBePromoted;
  public acceptPromotionRequest = acceptPromotionRequest;
  public connectPromotor = connectPromotor;
  public rejectPromotionRequest = rejectPromotionRequest;

  /*
    - add/remove speaker to the space group as admins
    - these methods are only to be used when the space hasnt started yet
  */
  public addSpeaker = addSpeaker;
  public removeSpeaker = removeSpeaker;

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
