import { useEffect, useRef, useState } from 'react';
import { SignerType, SpaceDTO, SpaceIFeeds } from '@pushprotocol/restapi';

import { SpacesUI } from '../components';
import { ThemeContext } from '../components/space/theme/ThemeProvider';
import { ISpacesTheme, lightTheme } from '../components/space/theme';
import {
  ISpaceDataContextValues,
  ISpaceInfo,
  ISpacePaginationData,
  ISpaceSpeakerData,
  SpaceDataContext,
} from '../context/spacesContext';
import { ENV } from '../config';

import * as PushAPI from '@pushprotocol/restapi';
import { usePushSpaceSocket, useSpaceNotificationSocket } from '../hooks';

import {
  LivepeerConfig,
  Player,
  createReactClient,
  studioProvider,
} from '@livepeer/react';

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
  const spacesObjectRef = useRef({} as PushAPI.space.Space);
  const [account, setAccount] = useState<string>(spaceUI.account);
  const [signer, setSigner] = useState<SignerType>(spaceUI.signer);
  const [pgpPrivateKey, setPgpPrivateKey] = useState<string>(
    spaceUI.pgpPrivateKey
  );
  const [env, setEnv] = useState<ENV>(spaceUI.env);
  const [spaceWidgetId, setSpaceWidgetId] = useState<string>('');

  const [speakerData, setSpeakerData] = useState({} as ISpaceSpeakerData);

  const [trendingListData, setTrendingListData] = useState(null);
  const [spaceInfo, setSpaceInfo] = useState({} as ISpaceInfo);
  const [spaceObjectData, setSpaceObjectData] = useState<PushAPI.SpaceData>(
    PushAPI.space.initSpaceData
  );

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

  const isJoined = Boolean(
    spaceObjectData?.connectionData?.meta?.broadcast?.livepeerInfo ||
      spaceObjectData?.spaceDescription
  );

  const livepeerClient = createReactClient({
    provider: studioProvider({
      apiKey: '2638ace1-0a3a-4853-b600-016e6125b9bc',
    }),
  });

  // const isLive = isLiveSpace();

  const setSpaceInfoItem = (key: string, value: SpaceDTO): void => {
    setSpaceInfo((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const setSpeakerDataItem = (
    key: string,
    value: PushAPI.video.VideoDataType
  ): void => {
    setSpeakerData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const initSpaceObject = async (spaceId: string) => {
    spacesObjectRef.current = new PushAPI.space.Space({
      signer,
      pgpPrivateKey,
      address: account,
      chainId: 5, // TODO: Make this dynamic
      env,
      setSpaceData: setSpaceObjectData,
    });
    await spacesObjectRef.current.initialize({ spaceId });
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

  const isSpeaker = Boolean(
    spaceObjectData?.members?.find((member) => {
      if (
        account?.toUpperCase() ===
        spaceObjectData.spaceCreator.replace('eip155:', '').toUpperCase()
      )
        return false;
      const address = member.wallet.replace('eip155:', '');
      return (
        address?.toUpperCase() === account?.toUpperCase() && member.isSpeaker
      );
    }) ||
      spaceObjectData?.pendingMembers?.find((member) => {
        const address = member.wallet.replace('eip155:', '');
        return (
          address?.toUpperCase() === account?.toUpperCase() && member.isSpeaker
        );
      })
  );

  const isListener = Boolean(
    spaceObjectData?.members?.find((member) => {
      console.log('member', member);
      const address = member.wallet.replace('eip155:', '');
      return (
        address.toUpperCase() === account.toUpperCase() && !member.isSpeaker
      );
    }) ||
      spaceObjectData?.pendingMembers?.find((member) => {
        console.log('pending member', member);
        const address = member.wallet.replace('eip155:', '');
        return (
          address.toUpperCase() === account.toUpperCase() && !member.isSpeaker
        );
      })
  );

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
    spaceWidgetId,
    setSpaceWidgetId,
    mySpaces,
    setMySpaces: setMySpacePaginationInfo,
    popularSpaces,
    setPopularSpaces: setPopularSpacePaginationInfo,
    spaceRequests,
    setSpaceRequests: setSpacesRequestPaginationInfo,
    spaceObjectData,
    setSpaceObjectData,
    initSpaceObject,
    spacesObjectRef,
    isJoined,
    isSpeaker,
    isListener,
    speakerData,
    setSpeakerData: setSpeakerDataItem,
  };

  useEffect(() => {
    setAccount(spaceUI.account);
    setSigner(spaceUI.signer);
    setEnv(spaceUI.env);
    setPgpPrivateKey(spaceUI.pgpPrivateKey);
  }, [spaceUI]);

  const PROVIDER_THEME = Object.assign({}, lightTheme, theme);

  spaceUI.init();
  useSpaceNotificationSocket({ account, env });
  usePushSpaceSocket({ account, env });

  return (
    <LivepeerConfig client={livepeerClient}>
      <ThemeContext.Provider value={PROVIDER_THEME}>
        <SpaceDataContext.Provider value={value}>
          {children}
        </SpaceDataContext.Provider>
      </ThemeContext.Provider>
    </LivepeerConfig>
  );
};
