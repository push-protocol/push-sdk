import { useContext, useEffect, useState } from 'react';
import * as PushAPI from '@pushprotocol/restapi';
import { ISpaceDataContextValues, SpaceDataContext } from '../../context/spacesContext';
import { SpaceDTO } from '@pushprotocol/restapi';

export const useGetSpaceInfo = (spaceId: string): SpaceDTO | undefined => {
  const { getSpaceInfo, setSpaceInfo }: ISpaceDataContextValues = useContext(SpaceDataContext);
  const [spaceData, setSpaceDataState] = useState<SpaceDTO | undefined>(getSpaceInfo(spaceId));

  useEffect(() => {
    const fetchData = async () => {
      if (!spaceData) {
        try {
          const response = await PushAPI.space.get({ spaceId });
          setSpaceInfo(spaceId, response);
          setSpaceDataState(response);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [spaceId, spaceData, getSpaceInfo, setSpaceInfo]);

  return spaceData;
};
