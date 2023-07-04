import React, { createContext } from 'react';
import { SpaceDTO, SpaceIFeeds } from '@pushprotocol/restapi';
import { SignerType } from '../types';
import { ENV } from '../config';

export interface ISpaceInfo {
  [key: string]: SpaceDTO;
}

export interface ISpaceDataContextValues {
  account: string;
  setAccount: React.Dispatch<React.SetStateAction<string>>;
  signer: SignerType | undefined;
  setSigner: React.Dispatch<React.SetStateAction<SignerType | undefined>>;
  pgpPrivateKey: string;
  setPgpPrivateKey: React.Dispatch<React.SetStateAction<string>>;
  env: ENV;
  setEnv: React.Dispatch<React.SetStateAction<ENV>>;
  trendingListData: any;
  setTrendingListData: React.Dispatch<React.SetStateAction<any>>;
  spaceInfo: ISpaceInfo;
  setSpaceInfo: (key: string, value: SpaceDTO) => void;
  getSpaceInfo: (key: string) => SpaceDTO | undefined;
  spacesPage: number;
  setSpacesPage: React.Dispatch<React.SetStateAction<number>>;
  popularPage: number;
  setPopularPage: React.Dispatch<React.SetStateAction<number>>;
  requestPage: number;
  setRequestPage: React.Dispatch<React.SetStateAction<number>>;
  mySpaces: SpaceIFeeds[];
  setMySpaces: React.Dispatch<React.SetStateAction<SpaceIFeeds[]>>;
  popularSpaces: SpaceIFeeds[];
  setPopularSpaces: React.Dispatch<React.SetStateAction<SpaceIFeeds[]>>;
  spaceRequests: SpaceIFeeds[];
  setSpaceRequests: React.Dispatch<React.SetStateAction<SpaceIFeeds[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const initialSpaceDataContextValues: ISpaceDataContextValues = {
  account: '',
  setAccount: () => { /**/ },
  signer: undefined,
  setSigner: () => { /**/ },
  pgpPrivateKey: '',
  setPgpPrivateKey: () => { /**/ },
  env: ENV.PROD,
  setEnv: () => { /**/ },
  trendingListData: null,
  setTrendingListData: () => {
    /**/
  },
  spaceInfo: {} as ISpaceInfo,
  setSpaceInfo: () => {
    /**/
  },
  getSpaceInfo: () => undefined,
  spacesPage: 1,
  setSpacesPage: () => {
    /**/
  },
  popularPage: 1,
  setPopularPage: () => {
    /**/
  },
  requestPage: 1,
  setRequestPage: () => {
    /**/
  },
  mySpaces: [] as SpaceIFeeds[],
  setMySpaces: () => {
    /**/
  },
  popularSpaces: [] as SpaceIFeeds[],
  setPopularSpaces: () => {
    /**/
  },
  spaceRequests: [] as SpaceIFeeds[],
  setSpaceRequests: () => {
    /**/
  },
  loading: false,
  setLoading: () => {
    /**/
  },
};

export const SpaceDataContext = createContext<ISpaceDataContextValues>(
  initialSpaceDataContextValues
);
