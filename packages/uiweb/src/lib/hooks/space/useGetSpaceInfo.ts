import { useContext, useEffect, useState } from 'react';
import * as PushAPI from '@pushprotocol/restapi';
import {
  ISpaceDataContextValues,
  SpaceDataContext,
} from '../../context/spacesContext';
import { SpaceDTO } from '@pushprotocol/restapi';

export const useGetSpaceInfo = (spaceId: string): SpaceDTO | undefined => {
  const { getSpaceInfo, setSpaceInfo, env }: ISpaceDataContextValues =
    useContext(SpaceDataContext);
  const [spaceData, setSpaceDataState] = useState<SpaceDTO | undefined>(
    getSpaceInfo(spaceId)
  );

  useEffect(() => {
    if (!spaceId) {
      return;
    }
    if(getSpaceInfo(spaceId)) {
      setSpaceDataState(getSpaceInfo(spaceId));
      return;
    }
    const fetchData = async () => {
      try {
        const response = await PushAPI.space.get({ spaceId, env });
        setSpaceInfo(spaceId, response);
        setSpaceDataState(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [spaceId]);

  return spaceData;
};
