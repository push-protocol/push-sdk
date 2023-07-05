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

      const newPopularSpaces = res;

      if (newPopularSpaces.length === 0) {
        setPopularSpaces({ lastPage: -1 });
        setLoading(false);
        return;
      }
      if (newPopularSpaces.length > 0) {
        setPopularSpaces({ apiData: newPopularSpaces });
      }
    } catch (error) {
      console.error('Error while fetching popular spaces:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPopularSpaces();
  }, [popularSpaces.currentPage]);
};
