import { useState } from "react";
import { SpacesUI } from "../components";
import { SpaceDataContext } from "../context";
import { ISpaceDataContextValues } from "../context/spacesContext";

export interface ISpacesUIProviderProps {
  spaceUI: SpacesUI;
  children: React.ReactNode;
}

export const SpacesUIProvider = ({ spaceUI, children }: ISpacesUIProviderProps) => {
  const [trendingListData, setTrendingListData] = useState(null);
  const [spaceBannerData, setSpaceBannerData] = useState(null);

  const value: ISpaceDataContextValues = {
    trendingListData,
    setTrendingListData,
    spaceBannerData,
    setSpaceBannerData,
  };

  spaceUI.init();

  return (
    <SpaceDataContext.Provider value={value}>{children}</SpaceDataContext.Provider>
  );
}
