import React, { createContext } from 'react';
import { SpaceDTO } from '@pushprotocol/restapi';

export interface ISpaceInfo {
  [key: string]: SpaceDTO;
}

export interface ISpaceDataContextValues {
  trendingListData: any;
  setTrendingListData: React.Dispatch<React.SetStateAction<any>>;
  spaceInfo: ISpaceInfo;
  setSpaceInfo: (key: string, value: SpaceDTO) => void;
  getSpaceInfo: (key: string) => SpaceDTO | undefined;
}

export const initialSpaceDataContextValues: ISpaceDataContextValues = {
  trendingListData: null,
  setTrendingListData: () => { /**/ },
  spaceInfo: {} as ISpaceInfo,
  setSpaceInfo: () => { /**/ },
  getSpaceInfo: () => undefined,
};

export const SpaceDataContext = createContext<ISpaceDataContextValues>(initialSpaceDataContextValues);
