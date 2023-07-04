import { useState } from "react";
import { SignerType, SpaceDTO, SpaceIFeeds } from "@pushprotocol/restapi";

import { SpacesUI } from "../components";
import { ThemeContext } from "../components/space/theme/ThemeProvider";
import { ISpacesTheme, lightTheme } from "../components/space/theme";
import { ISpaceDataContextValues, ISpaceInfo, SpaceDataContext } from "../context/spacesContext";
import { ENV } from "../config";

export interface ISpacesUIProviderProps {
  spaceUI: SpacesUI;
  theme: ISpacesTheme;
  children: React.ReactNode;
}

export const SpacesUIProvider = ({ spaceUI, theme, children }: ISpacesUIProviderProps) => {
  const [account, setAccount] = useState<string>('');
  const [signer, setSigner] = useState<SignerType>();
  const [pgpPrivateKey, setPgpPrivateKey] = useState<string>('');
  const [env, setEnv] = useState<ENV>(ENV.PROD);
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
