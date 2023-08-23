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
import axios from 'axios';
import { Client } from '@livepeer/webrtmp-sdk';

export interface StartSpaceType extends EnvOptionsType {
  spaceId: string;
  account?: string;
  signer?: SignerType;
  pgpPrivateKey?: string;
}

import type Space from './Space';
import { produce } from 'immer';
import { pCAIP10ToWallet } from '../helpers';
import { META_ACTION } from '../types/messageObjectTypes';
import sendLiveSpaceData from './helpers/sendLiveSpaceData';

type StartType = {
  livepeerApiKey: string;
};

export async function start(this: Space, options: StartType): Promise<void> {
  const { livepeerApiKey } = options || {};

  try {
    // host should have there audio stream
    if (!this.data.local.stream) {
      throw new Error('Local audio stream not found');
    }

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
      action: META_ACTION.CREATE_SPACE,
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

    // start the livepeer playback and store the playback URL group meta
    // send a notification/meta message to all the added listeners (members) telling the space has started

    // create the mergeStream object
    const mergeStreamObject = getMergeStreamObject(this.data.local.stream);
    // store the mergeStreamObject
    this.mergeStreamObject = mergeStreamObject;

    const url = 'https://livepeer.studio/api/stream';
    const data = {
      name: this.spaceSpecificData.spaceName,
      record: true,
    };

    const { data: responseData } = await axios.post(url, data, {
      headers: {
        Authorization: 'Bearer ' + livepeerApiKey,
      },
    });

    const { streamKey, playbackId } = responseData;

    console.log('livepeer details', streamKey, playbackId);

    // TODO: store the playbackId on group meta data, temp -> groupDescription
    this.update({ spaceDescription: playbackId });

    // cast to the stream
    const client = new Client();
    const session = client.cast(mergeStreamObject.result!, streamKey);
    session.on('open', () => {
      console.log('Live stream started.');
      // TODO: Update the space data
    });

    session.on('close', () => {
      console.log('Live stream stopped.');
      // TODO: Update the space data
    });

    session.on('error', (err) => {
      console.log('Live stream error.', err.message);
      // TODO: Update the space data
    });
  } catch (err) {
    console.error(`[Push SDK] - API  - Error - API ${start.name} -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API ${start.name} -: ${err}`);
  }
}
