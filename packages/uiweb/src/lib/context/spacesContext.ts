import React, { createContext } from 'react';
import { SpaceDTO } from '@pushprotocol/restapi';

// export interface ISpaceBannerData {
//   spaceId: string;
//   apiData: {
//     spaceName: string;
//     members : any;
//     pendingMembers : [];
//     scheduleAt: string;
//   };
// }

export interface ISpaceDataContextValues {
  trendingListData: any;
  setTrendingListData: React.Dispatch<React.SetStateAction<any>>;
  spaceBannerData: {[key:string]: SpaceDTO} | null;
  setSpaceBannerData: React.Dispatch<React.SetStateAction<any>>;
}

export const initialSpaceDataContextValues: ISpaceDataContextValues = {
  trendingListData: null,
  setTrendingListData: () => { /**/ },
  spaceBannerData: null,
  setSpaceBannerData: () => { /**/ },
};

export const SpaceDataContext = createContext<ISpaceDataContextValues>(initialSpaceDataContextValues);
