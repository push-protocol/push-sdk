import { useContext, useEffect, useState } from 'react';
import * as PushAPI from '@pushprotocol/restapi';
import {
  ISpaceDataContextValues,
  SpaceDataContext,
} from '../../context/spacesContext';
import { SpaceDTO } from '@pushprotocol/restapi';
import { ENV } from '../../config';

export const useGetSpaceInfo = (spaceId: string): SpaceDTO | undefined => {
  const { getSpaceInfo, setSpaceInfo, env, spaceInfo }: ISpaceDataContextValues =
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
      if (!spaceData) {
        try {
          const response = await PushAPI.space.get({ spaceId, env });
          setSpaceInfo(spaceId, response);
          setSpaceDataState(response);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchData();
  }, [spaceId, spaceData, getSpaceInfo, setSpaceInfo, spaceInfo, env]);

  return spaceData;
};
