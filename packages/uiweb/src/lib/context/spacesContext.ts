import React, { createContext } from 'react';
import * as PushAPI from '@pushprotocol/restapi';
import { SpaceDTO, SpaceIFeeds } from '@pushprotocol/restapi';
import { SignerType } from '../types';
import { ENV } from '../config';
import { FeedTabs } from '../components/space/SpaceFeed';

export interface ISpaceInfo {
  [key: string]: SpaceDTO;
}

export interface ISpaceSpeakerData {
  [key: string]: PushAPI.video.VideoDataType;
}

export interface ISpacePaginationData {
  apiData?: SpaceIFeeds[];
  currentPage?: number;
  lastPage?: number;
}

export interface ICustomSearchResult {
  account: string;
  name?: string;
  handle?: string;
  image?: string; // dataURL as string
}

export interface ISpaceDataContextValues {
  account: string;
  setAccount: React.Dispatch<React.SetStateAction<string>>;
  signer: SignerType | undefined;
  setSigner: React.Dispatch<React.SetStateAction<SignerType>>;
  pgpPrivateKey: string;
  setPgpPrivateKey: React.Dispatch<React.SetStateAction<string>>;
  env: ENV;
  setEnv: React.Dispatch<React.SetStateAction<ENV>>;
  chainId: number;
  setChainId: React.Dispatch<React.SetStateAction<number>>;
  selectedFeedTab: FeedTabs;
  setSelectedFeedTab: React.Dispatch<React.SetStateAction<FeedTabs>>;
  trendingListData: any;
  setTrendingListData: React.Dispatch<React.SetStateAction<any>>;
  spaceInfo: ISpaceInfo;
  setSpaceInfo: (key: string, value: SpaceDTO) => void;
  getSpaceInfo: (key: string) => SpaceDTO | undefined;
  spaceWidgetId: string;
  setSpaceWidgetId: React.Dispatch<React.SetStateAction<string>>;
  mySpaces: ISpacePaginationData;
  setMySpaces: (paginationData: ISpacePaginationData) => void;
  popularSpaces: ISpacePaginationData;
  setPopularSpaces: (paginationData: ISpacePaginationData) => void;
  spaceRequests: ISpacePaginationData;
  setSpaceRequests: (paginationData: ISpacePaginationData) => void;
  pushSpaceSocket: any;
  setPushSpaceSocket: React.Dispatch<React.SetStateAction<any>>;
  isPushSDKSocketConnected: boolean;
  setIsPushSDKSocketConnected: React.Dispatch<React.SetStateAction<boolean>>;
  spaceObjectData: PushAPI.SpaceData;
  setSpaceObjectData: (data: any) => void;
  initSpaceObject: (data: any) => Promise<void>;
  spacesObjectRef: React.MutableRefObject<any>;
  isJoined: boolean;
  // isLive: boolean;
  isSpeaker: boolean;
  isListener: boolean;
  speakerData: ISpaceSpeakerData;
  setSpeakerData: (key: string, value: PushAPI.video.VideoDataType) => void;
  acceptSpaceRequest: (spaceMetaData: PushAPI.video.VideoDataType) => Promise<void>;
  connectSpaceRequest: (spaceMetaData: PushAPI.video.VideoDataType) => Promise<void>;
  broadcastRaisedHand: (spaceMetaData: PushAPI.video.VideoDataType) => Promise<void>;
  customSearch?: (query: string) => ICustomSearchResult;
}

export const initialSpaceDataContextValues: ISpaceDataContextValues = {
  account: '',
  setAccount: () => {
    /**/
  },
  signer: undefined,
  setSigner: () => {
    /**/
  },
  pgpPrivateKey: '',
  setPgpPrivateKey: () => {
    /**/
  },
  env: ENV.DEV,
  setEnv: () => {
    /**/
  },
  chainId: 1,
  setChainId: () => {
    /** */
  },
  trendingListData: null,
  setTrendingListData: () => {
    /**/
  },
  selectedFeedTab: "Popular" as FeedTabs,
  setSelectedFeedTab: () => {
    /** */
  },
  spaceInfo: {} as ISpaceInfo,
  setSpaceInfo: () => {
    /**/
  },
  getSpaceInfo: () => undefined,
  spaceWidgetId: '',
  setSpaceWidgetId: () => {
    /**/
  },
  mySpaces: {
    apiData: [] as SpaceIFeeds[],
    currentPage: 1,
    lastPage: 2,
  } as ISpacePaginationData,
  setMySpaces: () => {
    /**/
  },
  popularSpaces: {
    apiData: [] as SpaceIFeeds[],
    currentPage: 1,
    lastPage: 2,
  } as ISpacePaginationData,
  setPopularSpaces: () => {
    /**/
  },
  spaceRequests: {
    apiData: [] as SpaceIFeeds[],
    currentPage: 1,
    lastPage: 2,
  } as ISpacePaginationData,
  setSpaceRequests: () => {
    /**/
  },
  pushSpaceSocket: null,
  setPushSpaceSocket: () => {
    /** */
  },
  isPushSDKSocketConnected: false,
  setIsPushSDKSocketConnected: () => {
    /** */
  },
  spaceObjectData: {} as PushAPI.SpaceData,
  setSpaceObjectData: () => {
    /**/
  },
  initSpaceObject: async () => {
    /**/
  },
  spacesObjectRef: {
    current: null,
  } as React.MutableRefObject<any>,
  isJoined: false,
  // isLive: false,
  isSpeaker: false,
  isListener: false,
  speakerData: {} as ISpaceSpeakerData,
  setSpeakerData: () => {
    /** */
  },
  acceptSpaceRequest: async () => {
    /** */
  },
  connectSpaceRequest: async () => {
    /** */
  },
  broadcastRaisedHand: async () => {
    /** */
  },
  customSearch: undefined,
};

export const SpaceDataContext = createContext<ISpaceDataContextValues>(
  initialSpaceDataContextValues
);
