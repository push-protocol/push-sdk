import { useSpaceData } from './useSpaceData';
import { useEffect, useState } from 'react';

import * as PushAPI from '@pushprotocol/restapi';

export const useMySpaces = (account: string) => {
  const LIMIT = 10;

  const { mySpaces, setMySpaces } = useSpaceData();
  const [loading, setLoading] = useState(false);

  const fetchMySpaces = async () => {
    setLoading(true);
    try {
      const res = await PushAPI.space.spaces({
        account: account,
        page: mySpaces.currentPage,
        limit: LIMIT,
      });

      const newMySpaces = res;

      if (newMySpaces.length === 0) {
        setMySpaces({ lastPage: -1 });
        setLoading(false);
        return;
      }
      if (newMySpaces.length > 0) {
        setMySpaces({ apiData: newMySpaces });
      }
    } catch (error) {
      console.error('Error while fetching Spaces For You:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMySpaces();
  }, [mySpaces.currentPage]);

  return { loading };
};
