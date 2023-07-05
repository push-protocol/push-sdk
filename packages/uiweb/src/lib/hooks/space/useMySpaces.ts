import { useSpaceData } from './useSpaceData';
import { useEffect } from 'react';

import * as PushAPI from '@pushprotocol/restapi';

export const useMySpaces = (account: string) => {
  const LIMIT = 1;

  const { mySpaces, setMySpaces, loading, setLoading } = useSpaceData();

  const fetchMySpaces = async () => {
    setLoading(true);
    try {
      const res = await PushAPI.space.spaces({
        account: account,
        page: mySpaces.currentPage,
        limit: LIMIT,
      });

      const newMySpaces = res || [];

      if (newMySpaces.length === 0) {
        setMySpaces({ lastPage: mySpaces.currentPage });
        setLoading(false);
        return;
      }
      if (newMySpaces.length > 0) {
        const existingIds = new Set(
          mySpaces.apiData?.map((space: any) => space.spaceId)
        );
        const uniqueSpaces = newMySpaces.filter(
          (space) => !existingIds.has(space.spaceId)
        );
        setMySpaces({ apiData: uniqueSpaces });
      }
    } catch (error) {
      console.error('Error while fetching Spaces For You:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMySpaces();
  }, []);
};
