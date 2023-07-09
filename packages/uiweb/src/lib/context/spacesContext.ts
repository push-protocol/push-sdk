import React, { createContext } from 'react';
import * as PushAPI from '@pushprotocol/restapi';
import { SpaceDTO, SpaceIFeeds } from '@pushprotocol/restapi';
import { SignerType } from '../types';
import { ENV } from '../config';

export interface ISpaceInfo {
  [key: string]: SpaceDTO;
}

export interface ISpacePaginationData {
  apiData?: SpaceIFeeds[];
  currentPage?: number;
  lastPage?: number;
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
  spaceObjectData: PushAPI.SpaceData;
  setSpaceObjectData: (data: any) => void;
  initSpaceObject: (data: any) => Promise<void>;
  spacesObjectRef: React.MutableRefObject<any>;
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
  trendingListData: null,
  setTrendingListData: () => {
    /**/
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
};

export const SpaceDataContext = createContext<ISpaceDataContextValues>(
  initialSpaceDataContextValues
);
