import { useSpaceData } from './useSpaceData';
import { useEffect } from 'react';

import * as PushAPI from '@pushprotocol/restapi';

export const usePopularSpaces = () => {
  const LIMIT = 10;
  const { popularSpaces, setPopularSpaces, loading, setLoading } =
    useSpaceData();

  const fetchPopularSpaces = async () => {
    setLoading(true);
    try {
      const res = await PushAPI.space.trending({
        page: popularSpaces.currentPage,
        limit: LIMIT,
      });

      const newPopularSpaces = res || [];

      if (newPopularSpaces.length === 0) {
        setPopularSpaces({ lastPage: popularSpaces.currentPage });
        setLoading(false);
        return;
      }
      if (newPopularSpaces.length > 0) {
        const existingIds = new Set(
          popularSpaces.apiData?.map((space: any) => space.spaceId)
        );
        const uniqueSpaces = newPopularSpaces.filter(
          (space) => !existingIds.has(space.spaceId)
        );
        setPopularSpaces({ apiData: uniqueSpaces });
      }
    } catch (error) {
      console.error('Error while fetching popular spaces:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPopularSpaces();
  }, []);
};
