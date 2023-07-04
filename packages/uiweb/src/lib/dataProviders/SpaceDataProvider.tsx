import { useState } from 'react';

import { SpaceDTO, SpaceIFeeds } from '@pushprotocol/restapi';

import { SpacesUI } from '../components';
import { ThemeContext } from '../components/space/theme/ThemeProvider';
import { ISpacesTheme, lightTheme } from '../components/space/theme';
import {
  ISpaceDataContextValues,
  ISpaceInfo,
  SpaceDataContext,
} from '../context/spacesContext';

export interface ISpacesUIProviderProps {
  spaceUI: SpacesUI;
  theme: ISpacesTheme;
  children: React.ReactNode;
}

export const SpacesUIProvider = ({
  spaceUI,
  theme,
  children,
}: ISpacesUIProviderProps) => {
  const [trendingListData, setTrendingListData] = useState(null);
  const [spaceInfo, setSpaceInfo] = useState({} as ISpaceInfo);
  const [spacesPage, setSpacesPage] = useState<number>(1);
  const [popularPage, setPopularPage] = useState<number>(1);
  const [requestPage, setRequestPage] = useState<number>(1);
  const [mySpaces, setMySpaces] = useState([] as SpaceIFeeds[]);
  const [popularSpaces, setPopularSpaces] = useState([] as SpaceIFeeds[]);
  const [spaceRequests, setSpaceRequests] = useState([] as SpaceIFeeds[]);
  const [loading, setLoading] = useState(false);

  const setSpaceInfoItem = (key: string, value: SpaceDTO): void => {
    setSpaceInfo((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const getSpaceInfo = (spaceId: string): SpaceDTO | undefined => {
    return spaceInfo[spaceId];
  };

  const value: ISpaceDataContextValues = {
    trendingListData,
    setTrendingListData,
    spaceInfo,
    setSpaceInfo: setSpaceInfoItem,
    getSpaceInfo,
    spacesPage,
    setSpacesPage,
    popularPage,
    setPopularPage,
    requestPage,
    setRequestPage,
    mySpaces,
    setMySpaces,
    popularSpaces,
    setPopularSpaces,
    spaceRequests,
    setSpaceRequests,
    loading,
    setLoading,
  };

  const PROVIDER_THEME = Object.assign({}, lightTheme, theme);

  spaceUI.init();

  return (
    <ThemeContext.Provider value={PROVIDER_THEME}>
      <SpaceDataContext.Provider value={value}>
        {children}
      </SpaceDataContext.Provider>
    </ThemeContext.Provider>
  );
};
