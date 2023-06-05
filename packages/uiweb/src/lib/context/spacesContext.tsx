import React, { createContext, useContext, useState } from 'react';

interface SpaceDataContext {
  trendingListData: any;
  setTrendingListData: React.Dispatch<React.SetStateAction<any>>;
  spaceBannerData: any;
  setSpaceBannerData: React.Dispatch<React.SetStateAction<any>>;
}

const SpaceDataContext = createContext<SpaceDataContext | undefined>(undefined);

export const useSpaceData = (): SpaceDataContext => {
  const context = useContext(SpaceDataContext);
  if (!context) {
    throw new Error('useSpaceData must be used within a SpaceDataProvider');
  }
  return context;
}

interface SpaceDataProviderProps {
  children: React.ReactNode;
}

export const SpaceDataProvider = ({ children }: SpaceDataProviderProps) => {
  const [trendingListData, setTrendingListData] = useState<any>(null);
  const [spaceBannerData, setSpaceBannerData] = useState<any>(null);

  const value: SpaceDataContext = {
    trendingListData,
    setTrendingListData,
    spaceBannerData,
    setSpaceBannerData,
  };

  return (
    <SpaceDataContext.Provider value={value}>{children}</SpaceDataContext.Provider>
  );
}
