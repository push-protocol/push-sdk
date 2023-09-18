import { useSpaceData } from './useSpaceData';
import { useEffect, useState } from 'react';

import * as PushAPI from '@pushprotocol/restapi';

export const useSpaceRequests = (account?: string) => {
  const LIMIT = 10;

  const { spaceRequests, setSpaceRequests, env } = useSpaceData();
  const [loading, setLoading] = useState(false);

  const fetchSpaceRequests = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const res = await PushAPI.space.requests({
        account: account,
        page: spaceRequests.currentPage,
        limit: LIMIT,
        toDecrypt: false,
        env,
      });

      const newSpaceRequests = res;

      if (newSpaceRequests.length === 0) {
        setSpaceRequests({ lastPage: -1 });
        setLoading(false);
        return;
      }
      if (newSpaceRequests.length > 0) {
        setSpaceRequests({ apiData: newSpaceRequests });
      }
    } catch (error) {
      console.error('Error while fetching spaces requests:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSpaceRequests();
  }, [spaceRequests.currentPage]);

  return { loading };
};
