import { createContext, useState } from "react";
import { SpacesUI } from "../components";

export interface SpacesUIProviderProps {
  spaceUI: SpacesUI;
  children: React.ReactNode;
}

export interface ISpaceDataContextValues {
  trendingListData: any;
  setTrendingListData: React.Dispatch<React.SetStateAction<any>>;
  spaceBannerData: any;
  setSpaceBannerData: React.Dispatch<React.SetStateAction<any>>;
}

export const initialSpaceDataContextValues: ISpaceDataContextValues = {
  trendingListData: null,
  setTrendingListData: () => { /**/ },
  spaceBannerData: null,
  setSpaceBannerData: () => { /**/ },
};

export const SpacesUIProvider: React.FC<SpacesUIProviderProps> = ({ spaceUI, children }) => {
  const [trendingListData, setTrendingListData] = useState(null);
  const [spaceBannerData, setSpaceBannerData] = useState(null);

  const SpaceDataContext = createContext<ISpaceDataContextValues>({
    trendingListData,
    setTrendingListData,
    spaceBannerData,
    setSpaceBannerData,
  });

  const value: ISpaceDataContextValues = {
    trendingListData,
    setTrendingListData,
    spaceBannerData,
    setSpaceBannerData,
  };

  spaceUI.init(SpaceDataContext);

  return (
    <SpaceDataContext.Provider value={value}>
      {children}
    </SpaceDataContext.Provider>
  );
};
