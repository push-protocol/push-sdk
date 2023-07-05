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

export const SpacesUIProvider = ({
  spaceUI,
  theme,
  children,
}: ISpacesUIProviderProps) => {
  const [account, setAccount] = useState<string>('');
  const [signer, setSigner] = useState<SignerType>();
  const [pgpPrivateKey, setPgpPrivateKey] = useState<string>('');
  const [env, setEnv] = useState<ENV>(ENV.PROD);
  const [trendingListData, setTrendingListData] = useState(null);
  const [spaceInfo, setSpaceInfo] = useState({} as ISpaceInfo);
  const [loading, setLoading] = useState(false);

  const [mySpaces, setMySpaces] = useState({
    apiData: [] as SpaceIFeeds[],
    currentPage: 1,
    lastPage: undefined,
  } as ISpacePaginationData);

  const [popularSpaces, setPopularSpaces] = useState({
    apiData: [] as SpaceIFeeds[],
    currentPage: 1,
    lastPage: undefined,
  } as ISpacePaginationData);

  const [spaceRequests, setSpaceRequests] = useState({
    apiData: [] as SpaceIFeeds[],
    currentPage: 1,
    lastPage: undefined,
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

  const setSpacePaginationInfo = (
    paginationInfo: ISpacePaginationData
  ): void => {
    const { apiData, currentPage, lastPage } = paginationInfo;
    setMySpaces((prevState) => {
      return {
        ...prevState,
        ...(apiData && { apiData }),
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
    setMySpaces: setSpacePaginationInfo,
    popularSpaces,
    setPopularSpaces: setSpacePaginationInfo,
    spaceRequests,
    setSpaceRequests: setSpacePaginationInfo,
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
