import { useState } from "react";

import { SpacesUI } from "../components";
import { ISpaceDataContextValues, SpaceDataContext } from "../context/spacesContext";
import { ThemeProvider } from "../components/space/theme/ThemeProvider";
import { Theme } from "../components/space/theme";

export interface ISpacesUIProviderProps  {
  spaceUI: SpacesUI;
  customTheme: Theme;
  children: React.ReactNode;
}

export const SpacesUIProvider = ({ spaceUI, customTheme, children }: ISpacesUIProviderProps) => {
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
    <ThemeProvider customTheme={customTheme}>
      <SpaceDataContext.Provider value={value}>
        {children}
      </SpaceDataContext.Provider>
    </ThemeProvider>
  );
}
