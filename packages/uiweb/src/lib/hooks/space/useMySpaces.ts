import { useSpaceData } from './useSpaceData';
import { useEffect } from 'react';

import * as PushAPI from '@pushprotocol/restapi';
import { ISpacePaginationData } from '../../context/spacesContext';

export const useMySpaces = (account: string) => {
  const LIMIT = 1;

  const { mySpaces, setMySpaces, setLoading } = useSpaceData();

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
};
