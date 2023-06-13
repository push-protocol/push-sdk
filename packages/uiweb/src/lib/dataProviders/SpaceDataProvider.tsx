import { useState } from "react";
import { SpaceDataContext } from "../context";
import { ISpaceDataContextValues } from "../context/spacesContext";

export interface ISpaceDataProviderProps {
  children: React.ReactNode;
}

export const SpaceDataProvider = ({ children }: ISpaceDataProviderProps) => {
  const [trendingListData, setTrendingListData] = useState(null);
  const [spaceBannerData, setSpaceBannerData] = useState(null);

  const value: ISpaceDataContextValues = {
    trendingListData,
    setTrendingListData,
    spaceBannerData,
    setSpaceBannerData,
  };

  return (
    <SpaceDataContext.Provider value={value}>{children}</SpaceDataContext.Provider>
  );
}
