import React, { useState } from 'react';
import styled from 'styled-components';

import { SpaceBanner } from '../SpaceBanner';

import { Checkbox } from '../reusables/Checkbox';

import { Spinner } from '../reusables/Spinner';

import {
  useSpaceData,
  useFeedScroll,
  useMySpaces,
  usePopularSpaces,
  useSpaceRequests,
} from '../../../hooks';

import filter from './../../../icons/filter.svg';
import { SpaceIFeeds } from '@pushprotocol/restapi';

enum OrientationEnums {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

enum Tabs {
  ForYou = 'For You',
  Popular = 'Popular',
  Requests = 'Requests',
}

enum FilterEnums {
  All = 'All',
  Live = 'Live',
  Scheduled = 'Scheduled',
}
export interface ISpaceFeedProps {
  account?: any;
  orientation?: 'horizontal' | 'vertical';
  height?: number;
  width?: number;
  sortingOrder?: string[];
  showTabs?: boolean;
  filter?: FilterEnums.All | FilterEnums.Live | FilterEnums.Scheduled;
}

export const SpaceFeed: React.FC<ISpaceFeedProps> = ({
  account = '0x6e9FECae20313664f97d4429886860221cb29c7A',
  orientation = 'veritcal',
  height,
  width,
  sortingOrder = [Tabs.ForYou, Tabs.Popular, Tabs.Requests],
  showTabs = true,
}) => {
  const [tab, setTab] = useState<string>(sortingOrder[0]);
  const [liveFilter, setLiveFilter] = useState(
    filter === FilterEnums.Live ? true : false
  );
  const [scheduledFilter, setScheduledFilter] = useState(
    filter === FilterEnums.Scheduled ? true : false
  );
  const [showFilter, setShowFilter] = useState(false);

  const {
    spacesPage,
    setSpacesPage,
    popularPage,
    setPopularPage,
    requestPage,
    setRequestPage,
    mySpaces,
    popularSpaces,
    spaceRequests,
    loading,
    setLoading,
  } = useSpaceData();

  const listInnerRef = useFeedScroll(mySpaces.length);

  const handleTabChange = (tab: string) => {
    setTab(tab);
  };

  const handleLive = () => {
    setLiveFilter(!liveFilter);
  };

  const handleScheduled = () => {
    setScheduledFilter(!scheduledFilter);
  };

  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleFilterData = (spacesList: any) => {
    if (liveFilter && scheduledFilter) {
      return spacesList;
    } else if (liveFilter) {
      return spacesList.filter(
        (space: any) => space.spaceInformation.status === 'ACTIVE'
      );
    } else if (scheduledFilter) {
      return spacesList.filter(
        (space: any) => space.spaceInformation.status === 'PENDING'
      );
    } else {
      return spacesList;
    }
  };

  const loadMoreData = async () => {
    setLoading(true);
    if (tab === Tabs.ForYou) setSpacesPage(spacesPage + 1);
    if (tab === Tabs.Popular) setPopularPage(popularPage + 1);
    if (tab === Tabs.Requests) setRequestPage(requestPage + 1);
    setLoading(false);
  };

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
  useMySpaces(account);
  usePopularSpaces();
  useSpaceRequests(account);

  return (
    <div>
      {orientation === OrientationEnums.Horizontal ? (
        <Spaces orientation={orientation}>
          {orientation === OrientationEnums.Horizontal
            ? mySpaces &&
              mySpaces.map((space: any, index: any) => {
                return (
                  <SpaceBanner spaceId={space.spaceId} orientation="pill" />
                );
              })
            : mySpaces &&
              mySpaces.map((space: any, index: any) => {
                return (
                  <SpaceBanner
                    spaceId={space?.spaceId}
                    orientation="maximized"
                  />
                );
              })}
        </Spaces>
      ) : (
        <>
          <Navigation showTabs={showTabs} width={width}>
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
            <Filter>
              <FilterButton onClick={handleShowFilter} />
              <FilterContainer showFilter={showFilter}>
                <Checkbox
                  id=""
                  label="Show Live"
                  value={liveFilter}
                  onChange={handleLive}
                />
                <Checkbox
                  id=""
                  label="Show Scheduled"
                  value={scheduledFilter}
                  onChange={handleScheduled}
                />
              </FilterContainer>
            </Filter>
          </Navigation>
          <ScrollContainer
            width={width}
            height={height}
            ref={listInnerRef}
            onScroll={onScroll}
          >
            <Container>
              {tab === Tabs.ForYou ? (
                <Spaces orientation={orientation}>
                  {mySpaces &&
                    handleFilterData(mySpaces).map(
                      (space: { spaceId: string }, index: any) => {
                        return (
                          <SpaceBanner
                            spaceId={space.spaceId}
                            orientation="maximized"
                          />
                        );
                      }
                    )}
                </Spaces>
              ) : tab === Tabs.Popular ? (
                <PopularSpaces>
                  <Text>Popular Spaces</Text>
                  {popularSpaces &&
                    handleFilterData(popularSpaces).map(
                      (space: { spaceId: string }, index: any) => {
                        return (
                          <SpaceBanner
                            spaceId={space.spaceId}
                            orientation="maximized"
                          />
                        );
                      }
                    )}
                </PopularSpaces>
              ) : (
                <Spaces orientation={orientation}>
                  {spaceRequests &&
                    handleFilterData(spaceRequests).map(
                      (space: { spaceId: string }, index: any) => {
                        return (
                          <SpaceBanner
                            spaceId={space.spaceId}
                            orientation="maximized"
                          />
                        );
                      }
                    )}
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
  width?: number;
}>`
  display: ${(props) => (props.showTabs ? 'flex' : 'none')};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 27px;
  width: ${(props) => (props.width ? `${props.width}px` : 'inherit')};
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
}`;

const Filter = styled.div`
  border: none;
  width: 24px;
  height: 24px;
}`;

const FilterButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: url(${filter}) no-repeat center;
  width: 24px;
  height: 24px;
  position: relative;
  top: 0;
  right: 0;
  z-index: 2;
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

const FilterContainer = styled.div<{ showFilter: boolean }>`
  display: ${(props) => (props.showFilter ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background: #ffffff;
  min-width: 160px;
  height: auto;
  padding: 18px 0px 18px 22px;
  border-radius: 12px;
  border: 1px solid #DCDCDF;
  gap: 16px;
  position: relative;
  top: 16px;
  right: 160px;
  z-index: 1;
}`;
