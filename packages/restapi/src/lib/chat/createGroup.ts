import { getAPIBaseUrls } from '../helpers';
import Constants from '../constants';
import { EnvOptionsType, GroupDTO, SignerType, Rules } from '../types';
import {
  ICreateGroupRequestPayload,
  createGroupPayload,
  createGroupRequestValidator,
  getWallet,
  getUserDID,
  IPGPHelper,
  PGPHelper,
  validateScheduleDates,
  getConnectedUserV2Core,
} from './helpers';
import * as CryptoJS from 'crypto-js';
import { axiosPost } from '../utils/axiosUtil';
import { handleError } from '../errors/ValidationError';

export interface ChatCreateGroupType extends EnvOptionsType {
  account?: string | null;
  signer?: SignerType | null;
  groupName: string;
  groupDescription?: string | null;
  members: Array<string>;
  groupImage?: string | null;
  admins: Array<string>;
  isPublic: boolean;
  contractAddressNFT?: string;
  numberOfNFTs?: number;
  contractAddressERC20?: string;
  numberOfERC20?: number;
  pgpPrivateKey?: string | null;
  meta?: string;
  groupType?: string | null;
  scheduleAt?: Date | null;
  scheduleEnd?: Date | null;
  rules?: Rules | null;
}

export const createGroup = async (options: ChatCreateGroupType) => {
  return await createGroupCore(options, PGPHelper);
};

export const createGroupCore = async (
  options: ChatCreateGroupType,
  pgpHelper: IPGPHelper
): Promise<GroupDTO> => {
  const {
    account = null,
    signer = null,
    groupName,
    groupDescription,
    members,
    groupImage,
    admins,
    isPublic,
    contractAddressNFT,
    numberOfNFTs,
    contractAddressERC20,
    numberOfERC20,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
    meta,
    groupType,
    scheduleAt,
    scheduleEnd,
    rules,
  } = options || {};

  try {
    if (account == null && signer == null) {
      throw new Error(`At least one from account or signer is necessary!`);
    }

    validateScheduleDates(scheduleAt, scheduleEnd);

    const wallet = getWallet({ account, signer });

    createGroupRequestValidator(
      groupName,
      members,
      admins,
      groupDescription,
      contractAddressNFT,
      numberOfNFTs,
      contractAddressERC20,
      numberOfERC20
    );

    const convertedMembersPromise = members.map(async (each) => {
      return getUserDID(each, env);
    });
    const convertedAdminsPromise = admins.map(async (each) => {
      return getUserDID(each, env);
    });
    const convertedMembers = await Promise.all(convertedMembersPromise);
    const convertedAdmins = await Promise.all(convertedAdminsPromise);

    const connectedUser = await getConnectedUserV2Core(
      wallet,
      pgpPrivateKey,
      env,
      pgpHelper
    );

    const bodyToBeHashed = {
      groupName: groupName,
      groupDescription: groupDescription == undefined ? null : groupDescription,
      members: convertedMembers,
      groupImage: groupImage == undefined ? null : groupImage,
      admins: convertedAdmins,
      isPublic: isPublic,
      contractAddressNFT:
        contractAddressNFT == undefined ? null : contractAddressNFT,
      numberOfNFTs: numberOfNFTs == undefined ? 0 : numberOfNFTs,
      contractAddressERC20:
        contractAddressERC20 == undefined ? null : contractAddressERC20,
      numberOfERC20: numberOfERC20 == undefined ? 0 : numberOfERC20,
      groupCreator: connectedUser.did,
    };

    const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
    const signature: string = await pgpHelper.sign({
      message: hash,
      signingKey: connectedUser.privateKey!,
    });
    const sigType = 'pgp';

    const verificationProof: string = sigType + ':' + signature;

    const API_BASE_URL = getAPIBaseUrls(env);
    const apiEndpoint = `${API_BASE_URL}/v1/chat/groups`;
    const body: ICreateGroupRequestPayload = createGroupPayload(
      groupName,
      convertedMembers,
      convertedAdmins,
      isPublic,
      connectedUser.did,
      verificationProof,
      groupDescription,
      groupImage,
      contractAddressNFT,
      numberOfNFTs,
      contractAddressERC20,
      numberOfERC20,
      meta,
      groupType,
      scheduleAt,
      scheduleEnd,
      rules
    );

    const response = await axiosPost(apiEndpoint, body);
    return response.data;
  } catch (err) {
      throw handleError(err, createGroup.name);
  }
};
