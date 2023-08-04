import { useEffect, useRef, useState } from 'react';
import { SignerType, SpaceDTO, SpaceIFeeds } from '@pushprotocol/restapi';

import { SpaceComponentWrapper } from './SpaceComponentsWrapper';
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

import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';
import { isAccountsEqual, spaceChainId } from '../components/space/helpers/account';
import { walletToPCAIP10, pCAIP10ToWallet } from '../helpers';

export enum FeedTabs {
  ForYou = 'For You',
  Popular = 'Popular',
  HostedByYou = 'Hosted by you',
}

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
  const [account, setAccount] = useState<string>(
    walletToPCAIP10(spaceUI.account)
  );
  const [signer, setSigner] = useState<SignerType>(spaceUI.signer);
  const [pgpPrivateKey, setPgpPrivateKey] = useState<string>(
    spaceUI.pgpPrivateKey
  );
  const [env, setEnv] = useState<ENV>(spaceUI.env);
  const [chainId, setChainId] = useState<number>(
    spaceChainId(spaceUI.account, spaceUI.env)
  );
  const [spaceWidgetId, setSpaceWidgetId] = useState<string>('');
  const [selectedFeedTab, setSelectedFeedTab] = useState<FeedTabs>(
    FeedTabs['Popular']
  );

  const [speakerData, setSpeakerData] = useState({} as ISpaceSpeakerData);

  const [trendingListData, setTrendingListData] = useState(null);
  const [spaceInfo, setSpaceInfo] = useState({} as ISpaceInfo);
  const [spaceObjectData, setSpaceObjectData] = useState<PushAPI.SpaceData>(
    PushAPI.space.initSpaceData
  );

  const [raisedHandInfo, setRaisedHandInfo] = useState<
    Record<string, PushAPI.video.VideoDataType>
  >({});

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

  const [pushSpaceSocket, setPushSpaceSocket] = useState<any>(null);
  const [isPushSDKSocketConnected, setIsPushSDKSocketConnected] =
    useState<boolean>(false);

  const isJoined = Boolean(
    spaceObjectData?.connectionData?.meta?.broadcast?.livepeerInfo ||
    spaceObjectData?.spaceDescription
  );

  const livepeerClient = createReactClient({
    provider: studioProvider({
      apiKey: 'ac9d3e33-56c2-4a22-a328-a08a46fd9356',
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
      chainId: chainId,
      env,
      setSpaceData: setSpaceObjectData,
    });
    await spacesObjectRef.current.initialize({ spaceId });
  };

  const acceptSpaceRequest = async ({
    senderAddress,
    recipientAddress,
    chatId,
    signalData,
  }: PushAPI.video.VideoDataType) => {
    console.log(
      'INSIDE WRAPPER ACCEPT REQUEST',
      'spacesObjectRef?.current',
      spacesObjectRef?.current
    );

    await spacesObjectRef.current?.acceptRequest({
      recipientAddress: senderAddress,
      senderAddress: recipientAddress,
      chatId,
      signalData,
    });
  };

  const connectSpaceRequest = async ({
    senderAddress,
    signalData,
  }: PushAPI.video.VideoDataType) => {
    console.log(
      'INSIDE WRAPPER CONNECT',
      'spacesObjectRef?.current',
      spacesObjectRef?.current
    );

    await spacesObjectRef.current.connect({
      peerAddress: senderAddress,
      signalData,
    });
  };

  const broadcastRaisedHand = async (
    receivedSpaceMetaData: PushAPI.video.VideoDataType
  ) => {
    await spacesObjectRef.current.broadcastRaisedHand({
      promoteeAddress: pCAIP10ToWallet(receivedSpaceMetaData.senderAddress),
    });

    setRaisedHandInfo((prevMap) => ({
      ...prevMap,
      [receivedSpaceMetaData.senderAddress]: receivedSpaceMetaData,
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
        const uniqueSpaces = apiData?.filter(
          (space) => !existingIds.has(space.spaceId)
        );

        let updatedApiData: SpaceIFeeds[] = [];
        if (prevState.apiData) {
          updatedApiData = [...prevState.apiData, ...uniqueSpaces];
          updatedApiData.sort(
            (a, b) =>
              new Date(b.intentTimestamp).getTime() -
              new Date(a.intentTimestamp).getTime()
          );
        } else {
          updatedApiData = uniqueSpaces;
        }
        return {
          ...prevState,
          ...(updatedApiData.length > 0 && {
            apiData: updatedApiData,
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
        const uniqueSpaces = apiData?.filter(
          (space) => !existingIds.has(space.spaceId)
        );

        let updatedApiData: SpaceIFeeds[] = [];
        if (prevState.apiData) {
          updatedApiData = [...prevState.apiData, ...uniqueSpaces];
          updatedApiData.sort(
            (a, b) =>
              new Date(b.intentTimestamp).getTime() -
              new Date(a.intentTimestamp).getTime()
          );
        } else {
          updatedApiData = uniqueSpaces;
        }
        return {
          ...prevState,
          ...(updatedApiData.length > 0 && {
            apiData: updatedApiData,
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
        const uniqueSpaces = apiData?.filter(
          (space) => !existingIds.has(space.spaceId)
        );

        let updatedApiData: SpaceIFeeds[] = [];
        if (prevState.apiData) {
          updatedApiData = [...prevState.apiData, ...uniqueSpaces];
          updatedApiData.sort(
            (a, b) =>
              new Date(b.intentTimestamp).getTime() -
              new Date(a.intentTimestamp).getTime()
          );
        } else {
          updatedApiData = uniqueSpaces;
        }
        return {
          ...prevState,
          ...(updatedApiData.length > 0 && {
            apiData: updatedApiData,
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
    // for the case when space isnt live
    spaceObjectData?.members?.find((member) => {
      if (isAccountsEqual(account, spaceObjectData?.spaceCreator))
        return false;
      const address = member.wallet;
      return (isAccountsEqual(account, address) && member.isSpeaker);
    }) ||
    spaceObjectData?.pendingMembers?.find((member) => {
      const address = member.wallet;
      return (isAccountsEqual(account, address) && member.isSpeaker);
    }) ||
    // for the case when the space is live
    spaceObjectData?.liveSpaceData?.speakers?.find((member) => {
      const address = member.address;
      return address === pCAIP10ToWallet(account);
    })
  );

  const isListener = spaceObjectData.spaceId ? !isSpeaker : false;

  const customSearch = undefined;

  const value: ISpaceDataContextValues = {
    account,
    setAccount,
    signer,
    setSigner,
    pgpPrivateKey,
    setPgpPrivateKey,
    env,
    setEnv,
    chainId,
    setChainId,
    trendingListData,
    setTrendingListData,
    spaceInfo,
    setSpaceInfo: setSpaceInfoItem,
    getSpaceInfo,
    spaceWidgetId,
    setSpaceWidgetId,
    selectedFeedTab,
    setSelectedFeedTab,
    mySpaces,
    setMySpaces: setMySpacePaginationInfo,
    popularSpaces,
    setPopularSpaces: setPopularSpacePaginationInfo,
    spaceRequests,
    setSpaceRequests: setSpacesRequestPaginationInfo,
    pushSpaceSocket,
    setPushSpaceSocket,
    isPushSDKSocketConnected,
    setIsPushSDKSocketConnected,
    spaceObjectData,
    setSpaceObjectData,
    initSpaceObject,
    spacesObjectRef,
    isJoined,
    isSpeaker,
    isListener,
    speakerData,
    setSpeakerData: setSpeakerDataItem,
    acceptSpaceRequest,
    connectSpaceRequest,
    broadcastRaisedHand,
    customSearch,
    raisedHandInfo,
  };

  const resetStates = () => {
    setSpeakerData({} as ISpaceSpeakerData);
    setSpaceObjectData(PushAPI.space.initSpaceData);
    setSpaceRequests({
      apiData: [] as SpaceIFeeds[],
      currentPage: 1,
      lastPage: 2,
    } as ISpacePaginationData);
    setMySpaces({
      apiData: [] as SpaceIFeeds[],
      currentPage: 1,
      lastPage: 2,
    } as ISpacePaginationData);
  };

  useEffect(() => {
    resetStates();
    setAccount(walletToPCAIP10(spaceUI.account));
    setEnv(spaceUI.env);

    // reset
    setChainId(spaceChainId(spaceUI.account, spaceUI.env));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaceUI.account, spaceUI.env]);

  useEffect(() => {
    setSigner(spaceUI.signer);
    setPgpPrivateKey(spaceUI.pgpPrivateKey);

  }, [spaceUI.pgpPrivateKey, spaceUI.signer]);

  const PROVIDER_THEME = Object.assign({}, lightTheme, theme);

  spaceUI.init();

  return (
    <LivepeerConfig client={livepeerClient}>
      <ThemeContext.Provider value={PROVIDER_THEME}>
        <SpaceDataContext.Provider value={value}>
          <SpaceComponentWrapper>{children}</SpaceComponentWrapper>
        </SpaceDataContext.Provider>
      </ThemeContext.Provider>
    </LivepeerConfig>
  );
};
