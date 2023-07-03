import { useSpaceData } from './useSpaceData';
import { useEffect } from 'react';

import * as PushAPI from '@pushprotocol/restapi';

export const useSpaceRequests = (account: string) => {
  const LIMIT = 10;

  const { requestPage, setRequestPage, spaceRequests, setSpaceRequests } =
    useSpaceData();

  const fetchSpaceRequests = async () => {
    try {
      const res = await PushAPI.space.requests({
        account: account,
        page: requestPage,
        limit: LIMIT,
      });

      const newSpaceRequests = res || [];

      if (newSpaceRequests.length === 0) return;
      if (newSpaceRequests.length > 0) {
        setSpaceRequests((prevSpaces: any = []) => {
          const existingIds = new Set(
            prevSpaces.map((space: any) => space.spaceId)
          );
          const uniqueSpaces = newSpaceRequests.filter(
            (space) => !existingIds.has(space.spaceId)
          );
          return [...prevSpaces, ...uniqueSpaces];
        });
      }
    } catch (error) {
      console.error('Error while fetching spaces requests:', error);
    }
  };

  useEffect(() => {
    fetchSpaceRequests();
  }, [requestPage]);
};
