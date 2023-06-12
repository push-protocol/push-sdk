import { useState, createContext } from "react";
import { SpacesUI } from "../components";

import { ISpaceDataContextValues } from "../context/spacesContext";
import { ThemeProvider } from "../components/space/theme/ThemeProvider";
import { Theme } from "../components/space/theme";

export interface ISpacesUIProviderProps  {
  spaceUI: SpacesUI;
  customTheme: Theme;
  children: React.ReactNode;
}

export const initialSpaceDataContextValues: ISpaceDataContextValues = {
  trendingListData: null,
  setTrendingListData: () => { /**/ },
  spaceBannerData: null,
  setSpaceBannerData: () => { /**/ },
};

export const SpacesUIProvider = ({ spaceUI, customTheme, children }: ISpacesUIProviderProps) => {
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

  spaceUI.init();

  return (
    <ThemeProvider customTheme={customTheme}>
      <SpaceDataContext.Provider value={value}>
        {children}
      </SpaceDataContext.Provider>
    </ThemeProvider>
  );
}
