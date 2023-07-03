import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import * as PushAPI from '@pushprotocol/restapi';

import { SpaceBanner } from '../SpaceBanner';

import { useSpaceData, usePopularSpaces } from '../../../hooks';
import { useMySpaces } from '../../../hooks/space/useMySpaces';
import { useSpaceRequests } from '../../../hooks/space/useSpaceRequests';

export interface ISpaceFeedProps {
  account?: any;
  orientation?: 'horizontal' | 'vertical';
  height?: number;
  width?: number;
  sortingOrder?: string[];
  showTabs?: boolean;
}

export const SpaceFeed: React.FC<ISpaceFeedProps> = ({
  account = '0x6e9FECae20313664f97d4429886860221cb29c7A',
  orientation = 'veritcal',
  height,
  width,
  sortingOrder = ['For You', 'Popular', 'Requests'],
  showTabs = true,
}) => {
  const LIMIT = 10;

  const [tab, setTab] = useState<string>(sortingOrder[0]);

  const {
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
  } = useSpaceData();

  const handleTabChange = (tab: string) => {
    setTab(tab);
  };

  const handleScroll = () => {
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    if (scrollTop + window.innerHeight + 1 >= scrollHeight) {
      if (tab === 'For You') setSpacesPage(spacesPage + 1);
      if (tab === 'Popular') setPopularPage(popularPage + 1);
      if (tab === 'Requests') setRequestPage(requestPage + 1);
    }
  };

  //API calls
  useMySpaces(account);
  usePopularSpaces();
  useSpaceRequests(account);

  //Infinte scroll
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      {orientation === 'horizontal' ? (
        <Spaces orientation={orientation}>
          {orientation === 'horizontal'
            ? mySpaces &&
              mySpaces.map((space: { spaceId: string }, index: any) => {
                return (
                  <SpaceBanner spaceId={space.spaceId} orientation="pill" />
                );
              })
            : mySpaces &&
              mySpaces.map((space: { spaceId: string }, index: any) => {
                return (
                  <SpaceBanner
                    spaceId={space.spaceId}
                    orientation="maximized"
                  />
                );
              })}
        </Spaces>
      ) : (
        <>
          <Navigation showTabs={showTabs} width={width}>
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
          </Navigation>
          <Container width={width} height={height}>
            {tab === 'For You' ? (
              <Spaces orientation={orientation}>
                {mySpaces &&
                  mySpaces.map((space: { spaceId: string }, index: any) => {
                    return (
                      <SpaceBanner
                        spaceId={space.spaceId}
                        orientation="maximized"
                      />
                    );
                  })}
              </Spaces>
            ) : tab === 'Popular' ? (
              <PopularSpaces>
                <Text>Popular Spaces</Text>
                {popularSpaces &&
                  popularSpaces.map(
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
                  spaceRequests.map(
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
          </Container>
        </>
      )}
    </div>
  );
};

//Styling
const Container = styled.div<{ height?: number; width?: number }>`
  display: flex;
  justify-content: space-between;
  align-items: left;
  background: #ffffff;
  border: 1px solid #dcdcdf;
  border-radius: 12px;
  width: ${(props) => (props.width ? `${props.width}px` : 'inherit')};
  height: ${(props) => (props.height ? `${props.height}px` : 'auto')};
  padding: 24px 32px;
}`;

const Navigation = styled.div<{
  showTabs?: boolean;
  width?: number;
}>`
  display: ${(props) => (props.showTabs ? 'flex' : 'none')};
  flex-direction: row;
  border-bottom: 1px solid #DCDCDF;
  margin-bottom: 27px;
  width: ${(props) => (props.width ? `${props.width}px` : 'inherit')};
}`;

const NavButton = styled.button<{ active?: boolean }>`
  padding: 10px 30px;
  font-weight: 450;
  font-size: 14px;
  border: none;
  border-bottom: ${(props) => (props.active ? '1px solid #8B5CF6' : 'none')};
  background: none;
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
