import { useEffect } from 'react';
import { useSpaceData } from './useSpaceData';
import * as PushAPI from '@pushprotocol/restapi';

export const useGetSpaceData = (spaceId: string) => {
  const { spaceBannerData, setSpaceBannerData } = useSpaceData();

  useEffect(() => {
    (async () => {
      if (spaceBannerData && spaceId in spaceBannerData) {
        return spaceBannerData;
      } else {
        await PushAPI.space
          .get({
            spaceId: spaceId,
          })
          .then((response) => {
            setSpaceBannerData({[spaceId]:response});
          })
          .catch((error) => {
            console.log(error);
          });
        return spaceBannerData;
      }
    })();
  }, [spaceId, spaceBannerData, setSpaceBannerData]);
};
