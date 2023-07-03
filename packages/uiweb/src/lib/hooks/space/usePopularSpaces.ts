import { useSpaceData } from './useSpaceData';
import { useCallback, useEffect, useRef } from 'react';

import * as PushAPI from '@pushprotocol/restapi';

export const usePopularSpaces = () => {
  const LIMIT = 10;
  const { popularPage, setPopularPage, popularSpaces, setPopularSpaces } =
    useSpaceData();

  const fetchPopularSpaces = async () => {
    try {
      const res = await PushAPI.space.trending({
        page: popularPage,
        limit: LIMIT,
      });

      const newPopularSpaces = res || [];

      if (newPopularSpaces.length === 0) return;
      if (newPopularSpaces.length > 0) {
        setPopularSpaces((prevSpaces: any = []) => {
          const existingIds = new Set(
            prevSpaces.map((space: any) => space.spaceId)
          );
          const uniqueSpaces = newPopularSpaces.filter(
            (space) => !existingIds.has(space.spaceId)
          );
          return [...prevSpaces, ...uniqueSpaces];
        });
      }
    } catch (error) {
      console.error('Error while fetching popular spaces:', error);
    }
  };

  useEffect(() => {
    fetchPopularSpaces();
  }, [popularPage]);
};
