import { useEffect } from 'react';
import { useSpaceData } from './useSpaceData';
import * as PushAPI from '@pushprotocol/restapi';

export const useGetSpaceData = (spaceId: string) => {
  const { spaceBannerData, setSpaceBannerData } = useSpaceData();

  useEffect(() => {
    (async () => {
      if (spaceBannerData) {
        console.log('Cache Data used!');
        console.log(spaceId in spaceBannerData);
        // setTimeout(() => {
        //   console.log(spaceBannerData[spaceId].spaceId);
        // }, 5000);
        return spaceBannerData;
      } else {
        await PushAPI.space
          .get({
            spaceId: spaceId,
          })
          .then((response) => {
            setSpaceBannerData({spaceId: response});
          })
          .catch((error) => {
            console.log(error);
          });
        console.log('API called.');
        return spaceBannerData;
      }
    })();
  }, [spaceId, spaceBannerData, setSpaceBannerData]);
};
