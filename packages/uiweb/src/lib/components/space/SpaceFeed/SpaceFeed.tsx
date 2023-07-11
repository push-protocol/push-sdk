import React, { useState } from 'react';
import styled from 'styled-components';

import { SpaceIFeeds } from '@pushprotocol/restapi';

import { SpaceBanner } from '../SpaceBanner';

import { Spinner } from '../reusables/Spinner';

import {
  useSpaceData,
  useFeedScroll,
  useMySpaces,
  usePopularSpaces,
  useSpaceRequests,
} from '../../../hooks';

import { ISpacePaginationData } from '../../../context/spacesContext';
import spacesIcon from '../../../icons/Spaces.svg';

enum OrientationEnums {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

enum Tabs {
  ForYou = 'For You',
  Popular = 'Popular',
  HostedByYou = 'Hosted by you',
}

enum FilterEnums {
  All = 'All',
  Live = 'Live',
  Scheduled = 'Scheduled',
}
export interface ISpaceFeedProps {
  orientation?: 'horizontal' | 'vertical';
  height?: number;
  width?: number;
  sortingOrder?: string[];
  showTabs?: boolean;
  filter?: FilterEnums.All | FilterEnums.Live | FilterEnums.Scheduled;
  showFilter?: boolean;
  onBannerClickHandler?: (arg: string) => void;
}

export const SpaceFeed: React.FC<ISpaceFeedProps> = ({
  orientation = 'veritcal',
  height,
  width,
  sortingOrder = [Tabs.Popular, Tabs.ForYou, Tabs.HostedByYou],
  showTabs = true,
  filter = FilterEnums.All,
  showFilter = true,
  onBannerClickHandler,
}) => {
  const [tab, setTab] = useState<string>(sortingOrder[0]);
  const [filterTab, setFilterTab] = useState(filter);

  const {
    account,
    mySpaces,
    setMySpaces,
    popularSpaces,
    setPopularSpaces,
    spaceRequests,
    setSpaceRequests,
  } = useSpaceData();

  const listInnerRef = useFeedScroll(mySpaces.apiData?.length);

  const handleTabChange = (tab: string) => {
    setTab(tab);
  };

  const handleFilterData = (spacesList: SpaceIFeeds[]) => {
    if (filterTab === FilterEnums.All) {
      return spacesList;
    } else if (filterTab === FilterEnums.Live) {
      return spacesList.filter(
        (space: SpaceIFeeds) => space.spaceInformation?.status === 'ACTIVE'
      );
    } else if (filterTab === FilterEnums.Scheduled) {
      return spacesList.filter(
        (space: SpaceIFeeds) => space.spaceInformation?.status === 'PENDING'
      );
    } else {
      return spacesList;
    }
  };

  const handleMySpacesFilter = (spacesList: SpaceIFeeds[]) => {
    if (tab === Tabs.HostedByYou) {
      return spacesList.filter(
        (space: SpaceIFeeds) =>
          space.spaceInformation?.spaceCreator.slice(7).toUpperCase() ===
          account?.toUpperCase()
      );
    }
    if (tab === Tabs.ForYou) {
      return spacesList.filter(
        (space: SpaceIFeeds) =>
          space.spaceInformation?.spaceCreator.slice(7).toUpperCase() !==
          account?.toUpperCase()
      );
    } else {
      return handleFilterData(spacesList);
    }
  };

  const handleClick = (spaceId: string) => {
    if (onBannerClickHandler) {
      return onBannerClickHandler(spaceId || '');
    }
  };

  const incrementSpacePage = async (spaces: ISpacePaginationData) => {
    if (
      loading === false &&
      spaces.currentPage &&
      spaces.lastPage &&
      spaces.currentPage < spaces.lastPage
    ) {
      if (spaces === mySpaces)
        spaces.currentPage &&
          console.log('spaces.currentPage', spaces.currentPage, Date.now());
      setMySpaces({
        currentPage: spaces.currentPage + 1,
        lastPage: spaces.lastPage + 1,
      });
      if (spaces === popularSpaces)
        spaces.currentPage &&
          setPopularSpaces({
            currentPage: spaces.currentPage + 1,
            lastPage: spaces.lastPage + 1,
          });
      if (spaces === spaceRequests)
        spaces.currentPage &&
          setSpaceRequests({
            currentPage: spaces.currentPage + 1,
            lastPage: spaces.lastPage + 1,
          });
    } else {
      return;
    }
  };

  const loadMoreData = async () => {
    if (tab === Tabs.ForYou) {
      incrementSpacePage(mySpaces);
    }
    if (tab === Tabs.Popular) {
      incrementSpacePage(popularSpaces);
    }
    if (tab === Tabs.HostedByYou) {
      incrementSpacePage(spaceRequests);
    }
  };

  console.log(account);

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop } = listInnerRef.current;
      const { offsetHeight } = listInnerRef.current;
      const { scrollHeight } = listInnerRef.current;

      if (scrollTop + offsetHeight + 1 >= scrollHeight) {
        loadMoreData();
      }
    }
  };

  //API calls

  const mySpaceLoading = useMySpaces(account);
  const popularSpaceLoading = usePopularSpaces();
  const spaceRequestsLoading = useSpaceRequests(account);
  const { loading } =
    mySpaceLoading || popularSpaceLoading || spaceRequestsLoading;

  return (
    <div>
      {orientation === OrientationEnums.Horizontal ? (
        <Spaces orientation={orientation}>
          {orientation === OrientationEnums.Horizontal
            ? mySpaces &&
              mySpaces.apiData?.map((space: SpaceIFeeds) => {
                return (
                  <SpaceBanner
                    spaceId={space.spaceId as string}
                    orientation="pill"
                    onBannerClick={
                      onBannerClickHandler ? handleClick : undefined
                    }
                  />
                );
              })
            : mySpaces &&
              mySpaces.apiData?.map((space: SpaceIFeeds) => {
                return (
                  <SpaceBanner
                    spaceId={space.spaceId as string}
                    orientation="maximized"
                    onBannerClick={
                      onBannerClickHandler ? handleClick : undefined
                    }
                  />
                );
              })}
        </Spaces>
      ) : (
        <>
          <Navigation showTabs={showTabs} width={width} showFilter={showFilter}>
            <NavButtonWrapper>
              {sortingOrder.map((tabName: string) => {
                return (
                  <NavButton
                    active={tab === tabName}
                    onClick={() => handleTabChange(tabName)}
                  >
                    {tabName}
                  </NavButton>
                );
              })}
            </NavButtonWrapper>
          </Navigation>
          <Filter showFilter={showFilter}>
            <FilterButton
              active={filterTab === FilterEnums.All}
              onClick={() => setFilterTab(FilterEnums.All)}
            >
              All
            </FilterButton>
            <FilterButton
              active={filterTab === FilterEnums.Live}
              onClick={() => setFilterTab(FilterEnums.Live)}
            >
              Live
            </FilterButton>
            <FilterButton
              active={filterTab === FilterEnums.Scheduled}
              onClick={() => setFilterTab(FilterEnums.Scheduled)}
            >
              Scheduled
            </FilterButton>
          </Filter>
          <ScrollContainer
            width={width}
            height={height}
            ref={listInnerRef}
            onScroll={onScroll}
          >
            <Container>
              {tab === Tabs.ForYou ? (
                <Spaces orientation={orientation}>
                  {mySpaces.apiData &&
                    (handleFilterData(
                      handleMySpacesFilter(mySpaces.apiData as SpaceIFeeds[])
                    ).length === 0 ? (
                      <NoSpaces>
                        <SpacesIcon src={spacesIcon} />
                        <NoSpacesTextV1>Join a space</NoSpacesTextV1>
                        <NoSpacesTextV2>
                          Get started by joining a space
                        </NoSpacesTextV2>
                      </NoSpaces>
                    ) : (
                      handleFilterData(
                        handleMySpacesFilter(mySpaces.apiData as SpaceIFeeds[])
                      ).map((space: SpaceIFeeds) => {
                        return (
                          <SpaceBanner
                            spaceId={space.spaceId as string}
                            orientation="maximized"
                            onBannerClick={
                              onBannerClickHandler ? handleClick : undefined
                            }
                          />
                        );
                      })
                    ))}
                </Spaces>
              ) : tab === Tabs.Popular ? (
                <PopularSpaces>
                  <Text>Popular Spaces</Text>
                  {popularSpaces &&
                    handleFilterData(
                      popularSpaces.apiData as SpaceIFeeds[]
                    ).map((space: SpaceIFeeds) => {
                      return (
                        <SpaceBanner
                          spaceId={space.spaceId as string}
                          orientation="maximized"
                          onBannerClick={
                            onBannerClickHandler ? handleClick : undefined
                          }
                        />
                      );
                    })}
                </PopularSpaces>
              ) : (
                <Spaces orientation={orientation}>
                  {mySpaces.apiData &&
                    (handleFilterData(
                      handleMySpacesFilter(mySpaces.apiData as SpaceIFeeds[])
                    ).length === 0 ? (
                      <NoSpaces>
                        <SpacesIcon src={spacesIcon} />
                        <NoSpacesTextV1>Create a space</NoSpacesTextV1>
                        <NoSpacesTextV2>
                          Get started by creating a space
                        </NoSpacesTextV2>
                      </NoSpaces>
                    ) : (
                      handleFilterData(
                        handleMySpacesFilter(mySpaces.apiData as SpaceIFeeds[])
                      ).map((space: SpaceIFeeds) => {
                        return (
                          <SpaceBanner
                            spaceId={space.spaceId as string}
                            orientation="maximized"
                            onBannerClick={
                              onBannerClickHandler ? handleClick : undefined
                            }
                          />
                        );
                      })
                    ))}
                </Spaces>
              )}
              {loading && <Spinner size="40" />}
            </Container>
          </ScrollContainer>
        </>
      )}
    </div>
  );
};

//Styling
const ScrollContainer = styled.div<{ height?: number; width?: number }>`
  width: ${(props) => (props.width ? `${props.width}px` : 'inherit')};
  height: ${(props) => (props.height ? `${props.height}px` : 'auto')};
  overflow-y: auto;
}`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  border: 1px solid #dcdcdf;
  border-radius: 12px;
  padding: 24px 32px;
}`;

const Navigation = styled.div<{
  showTabs?: boolean;
  showFilter?: boolean;
  width?: number;
}>`
  display: ${(props) => (props.showTabs ? 'flex' : 'none')};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: ${(props) => (props.width ? `${props.width}px` : 'inherit')};
  border-bottom: 1px solid #DCDCDF;
  margin-bottom: ${(props) => (props.showFilter ? '0' : '27px')};
}`;

const NavButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}`;

const NavButton = styled.button<{ active?: boolean }>`
  padding: 10px 30px;
  font-weight: 450;
  font-size: 14px;
  border: none;
  border-bottom: ${(props) => (props.active ? '2px solid #8B5CF6' : 'none')};
  background: none;
  color : ${(props) => (props.active ? '#000000' : '#71717A')};

  &:hover {
    cursor: pointer;
  }
}`;

const Spaces = styled.div<{ orientation?: string }>`
  display: flex;
  flex-direction: ${(props) =>
    props.orientation === 'horizontal' ? 'row' : 'column'};
  justify-content: flex-start;
  align-items: center;
  background: #ffffff;
  width: ${(props) =>
    props.orientation === 'horizontal' ? 'inherit' : '100%'};
  height: auto;
  gap: 16px;
}`;

const PopularSpaces = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  width: 100%;  
  height: auto;
  gap: 16px;
}`;

const Text = styled.div`
  width: 100%;
  text-align: left;
  font-family: 'Strawford';
  font-weight: 450;
  font-size: 18px;
}`;

const Filter = styled.div<{ showFilter?: boolean }>`
  display: ${(props) => (props.showFilter ? 'flex' : 'none')};
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background: #ffffff;
  width: 100%;
  margin: 22px 0;
}`;

const FilterButton = styled.button<{ active: boolean }>`
  display: inline-flex;
  height: 30px;
  padding: 0px 16px;
  justify-content: center;
  align-items: center;
  border-radius: 99px;
  border: 1px solid #C4B5FD;
  background: ${(props) => (props.active ? '#8B5CF6' : '#EDE9FE')};
  color: ${(props) => (!props.active ? '#8B5CF6' : '#FFF')};
  margin-right: 8px;
  font-size: 14px;

  &:hover {
    cursor: pointer;
  }
}`;

const NoSpaces = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 130px 0;
}`;

const SpacesIcon = styled.img`
  width: 36px;
  height: 36px;
}`;

const NoSpacesTextV1 = styled.div`
  font-family: 'Strawford';
  font-weight: 450;
  font-size: 16px;
  color: #000;
}`;

const NoSpacesTextV2 = styled.div`
  font-family: 'Strawford';
  font-weight: 450;
  color: #71717A;
  font-size: 14px;
}`;
