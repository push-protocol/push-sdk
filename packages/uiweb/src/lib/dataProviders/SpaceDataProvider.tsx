import { useState } from "react";

import { SpacesUI } from "../components";
import { ISpaceDataContextValues, SpaceDataContext } from "../context/spacesContext";
import { ThemeContext } from "../components/space/theme/ThemeProvider";
import { ISpacesTheme, lightTheme } from "../components/space/theme";

export interface ISpacesUIProviderProps  {
  spaceUI: SpacesUI;
  theme: ISpacesTheme;
  children: React.ReactNode;
}

export const SpacesUIProvider = ({ spaceUI, theme, children }: ISpacesUIProviderProps) => {
  const [trendingListData, setTrendingListData] = useState(null);
  const [spaceBannerData, setSpaceBannerData] = useState(null);

  const value: ISpaceDataContextValues = {
    trendingListData,
    setTrendingListData,
    spaceBannerData,
    setSpaceBannerData,
  };

  const mergedTheme = Object.assign({}, lightTheme, theme);

  console.log(mergedTheme)

  spaceUI.init();

  return (
    <ThemeContext.Provider value={mergedTheme}>
      <SpaceDataContext.Provider value={value}>
        {children}
      </SpaceDataContext.Provider>
    </ThemeContext.Provider>
  );
}
