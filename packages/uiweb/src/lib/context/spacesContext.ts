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
  spacesPage: number;
  setSpacesPage: React.Dispatch<React.SetStateAction<number>>;
  popularPage: number;
  setPopularPage: React.Dispatch<React.SetStateAction<number>>;
  requestPage: number;
  setRequestPage: React.Dispatch<React.SetStateAction<number>>;
  mySpaces: any;
  setMySpaces: React.Dispatch<React.SetStateAction<any>>;
  popularSpaces: any;
  setPopularSpaces: React.Dispatch<React.SetStateAction<any>>;
  spaceRequests: any;
  setSpaceRequests: React.Dispatch<React.SetStateAction<any>>;
}

export const initialSpaceDataContextValues: ISpaceDataContextValues = {
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
  mySpaces: [],
  setMySpaces: () => {
    /**/
  },
  popularSpaces: [],
  setPopularSpaces: () => {
    /**/
  },
  spaceRequests: [],
  setSpaceRequests: () => {
    /**/
  },
};

export const SpaceDataContext = createContext<ISpaceDataContextValues>(
  initialSpaceDataContextValues
);
