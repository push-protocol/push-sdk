import React, { createContext } from 'react';

export interface ISpaceDataContextValues {
  trendingListData: any;
  setTrendingListData: React.Dispatch<React.SetStateAction<any>>;
  spaceBannerData: any;
  setSpaceBannerData: React.Dispatch<React.SetStateAction<any>>;
}

export const SpaceDataContext = createContext<ISpaceDataContextValues | undefined>(undefined);
