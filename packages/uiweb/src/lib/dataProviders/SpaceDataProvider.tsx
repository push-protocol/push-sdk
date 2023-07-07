import { useState } from 'react';
import { SignerType, SpaceDTO, SpaceIFeeds } from '@pushprotocol/restapi';

import { SpacesUI } from '../components';
import { ThemeContext } from '../components/space/theme/ThemeProvider';
import { ISpacesTheme, lightTheme } from '../components/space/theme';
import {
  ISpaceDataContextValues,
  ISpaceInfo,
  ISpacePaginationData,
  SpaceDataContext,
} from '../context/spacesContext';
import { ENV } from '../config';

export interface ISpacesUIProviderProps {
  spaceUI: SpacesUI;
  theme: ISpacesTheme;
  children: React.ReactNode;
}

export const SpacesUIProvider = ({ spaceUI, theme, children }: ISpacesUIProviderProps) => {
  const [account, setAccount] = useState<string>(spaceUI.account);
  const [signer, setSigner] = useState<SignerType>(spaceUI.signer);
  const [pgpPrivateKey, setPgpPrivateKey] = useState<string>(spaceUI.pgpPrivateKey);
  const [env, setEnv] = useState<ENV>(spaceUI.env);
  const [trendingListData, setTrendingListData] = useState(null);
  const [spaceInfo, setSpaceInfo] = useState({} as ISpaceInfo);

  const [mySpaces, setMySpaces] = useState({
    apiData: [] as SpaceIFeeds[],
    currentPage: 1,
    lastPage: 2,
  } as ISpacePaginationData);

  const [popularSpaces, setPopularSpaces] = useState({
    apiData: [] as SpaceIFeeds[],
    currentPage: 1,
    lastPage: 2,
  } as ISpacePaginationData);

  const [spaceRequests, setSpaceRequests] = useState({
    apiData: [] as SpaceIFeeds[],
    currentPage: 1,
    lastPage: 2,
  } as ISpacePaginationData);

  const setSpaceInfoItem = (key: string, value: SpaceDTO): void => {
    setSpaceInfo((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const getSpaceInfo = (spaceId: string): SpaceDTO | undefined => {
    return spaceInfo[spaceId];
  };

  const setMySpacePaginationInfo = (
    paginationInfo: ISpacePaginationData
  ): void => {
    const { apiData, currentPage, lastPage } = paginationInfo;
    setMySpaces((prevState) => {
      if (apiData) {
        const existingIds = new Set(
          prevState.apiData?.map((space: SpaceIFeeds) => space.spaceId)
        );
        console.log('Existing ID', existingIds);
        const uniqueSpaces = apiData?.filter(
          (space) => !existingIds.has(space.spaceId)
        );
        console.log('Unique Spaces', uniqueSpaces);
        return {
          ...prevState,
          ...(uniqueSpaces &&
            prevState.apiData && {
              apiData: [...prevState.apiData, ...uniqueSpaces],
            }),
        };
      }
      return {
        ...prevState,
        ...(currentPage && { currentPage }),
        ...(lastPage && { lastPage }),
      };
    });
  };

  const setPopularSpacePaginationInfo = (
    paginationInfo: ISpacePaginationData
  ): void => {
    const { apiData, currentPage, lastPage } = paginationInfo;
    setPopularSpaces((prevState) => {
      if (apiData) {
        const existingIds = new Set(
          prevState.apiData?.map((space: SpaceIFeeds) => space.spaceId)
        );
        console.log('Existing ID', existingIds);
        const uniqueSpaces = apiData?.filter(
          (space) => !existingIds.has(space.spaceId)
        );
        console.log('Unique Spaces', uniqueSpaces);
        return {
          ...prevState,
          ...(uniqueSpaces &&
            prevState.apiData && {
              apiData: [...prevState.apiData, ...uniqueSpaces],
            }),
        };
      }
      return {
        ...prevState,
        ...(currentPage && { currentPage }),
        ...(lastPage && { lastPage }),
      };
    });
  };

  const setSpacesRequestPaginationInfo = (
    paginationInfo: ISpacePaginationData
  ): void => {
    const { apiData, currentPage, lastPage } = paginationInfo;
    setSpaceRequests((prevState) => {
      if (apiData) {
        const existingIds = new Set(
          prevState.apiData?.map((space: SpaceIFeeds) => space.spaceId)
        );
        console.log('Existing ID', existingIds);
        const uniqueSpaces = apiData?.filter(
          (space) => !existingIds.has(space.spaceId)
        );
        console.log('Unique Spaces', uniqueSpaces);
        return {
          ...prevState,
          ...(uniqueSpaces &&
            prevState.apiData && {
              apiData: [...prevState.apiData, ...uniqueSpaces],
            }),
        };
      }
      return {
        ...prevState,
        ...(currentPage && { currentPage }),
        ...(lastPage && { lastPage }),
      };
    });
  };

  const value: ISpaceDataContextValues = {
    account,
    setAccount,
    signer,
    setSigner,
    pgpPrivateKey,
    setPgpPrivateKey,
    env,
    setEnv,
    trendingListData,
    setTrendingListData,
    spaceInfo,
    setSpaceInfo: setSpaceInfoItem,
    getSpaceInfo,
    mySpaces,
    setMySpaces: setMySpacePaginationInfo,
    popularSpaces,
    setPopularSpaces: setPopularSpacePaginationInfo,
    spaceRequests,
    setSpaceRequests: setSpacesRequestPaginationInfo,
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
