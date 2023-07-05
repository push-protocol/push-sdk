import { useSpaceData } from './useSpaceData';
import { useEffect } from 'react';

import * as PushAPI from '@pushprotocol/restapi';

export const useSpaceRequests = (account: string) => {
  const LIMIT = 10;

  const { spaceRequests, setSpaceRequests, loading, setLoading } =
    useSpaceData();

  const fetchSpaceRequests = async () => {
    setLoading(true);
    try {
      const res = await PushAPI.space.requests({
        account: account,
        page: spaceRequests.currentPage,
        limit: LIMIT,
      });

      const newSpaceRequests = res || [];

      if (newSpaceRequests.length === 0) {
        setSpaceRequests({ lastPage: spaceRequests.currentPage });
        setLoading(false);
        return;
      }
      if (newSpaceRequests.length > 0) {
        const existingIds = new Set(
          spaceRequests.apiData?.map((space: any) => space.spaceId)
        );
        const uniqueSpaces = newSpaceRequests.filter(
          (space) => !existingIds.has(space.spaceId)
        );
        setSpaceRequests({ apiData: uniqueSpaces });
      }
    } catch (error) {
      console.error('Error while fetching spaces requests:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSpaceRequests();
  }, []);
};
