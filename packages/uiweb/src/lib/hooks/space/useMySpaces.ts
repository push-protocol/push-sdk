import { useSpaceData } from './useSpaceData';
import { useEffect } from 'react';

import * as PushAPI from '@pushprotocol/restapi';

export const useMySpaces = (account: string) => {
  const LIMIT = 1;

  const { spacesPage, setSpacesPage, mySpaces, setMySpaces } = useSpaceData();

  const fetchMySpaces = async () => {
    try {
      const res = await PushAPI.space.spaces({
        account: account,
        page: spacesPage,
        limit: LIMIT,
      });

      const newMySpaces = res || [];

      if (newMySpaces.length === 0) return;
      if (newMySpaces.length > 0) {
        setMySpaces((prevSpaces: any = []) => {
          const existingIds = new Set(
            prevSpaces.map((space: any) => space.spaceId)
          );
          const uniqueSpaces = newMySpaces.filter(
            (space) => !existingIds.has(space.spaceId)
          );
          return [...prevSpaces, ...uniqueSpaces];
        });
      }
    } catch (error) {
      console.error('Error while fetching Spaces For You:', error);
    }
  };

  useEffect(() => {
    fetchMySpaces();
  }, [spacesPage]);
};
