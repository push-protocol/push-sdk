import React, { createContext } from 'react';
import { SpaceDTO } from '@pushprotocol/restapi';
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
  setTrendingListData: () => { /**/ },
  spaceInfo: {} as ISpaceInfo,
  setSpaceInfo: () => { /**/ },
  getSpaceInfo: () => undefined,
};

export const SpaceDataContext = createContext<ISpaceDataContextValues>(initialSpaceDataContextValues);
