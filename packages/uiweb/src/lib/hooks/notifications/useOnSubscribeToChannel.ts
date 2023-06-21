import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { ChatAndNotificationPropsContext, NotificationMainStateContext } from '../../context';

import { convertAddressToAddrCaip } from '../../helpers/notification';

interface onSubscribeToChannel {
  channelAddress: string;
}

const useOnSubscribeToChannel = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const { setChannelSubscriptionStatus } = useContext<any>(
    NotificationMainStateContext
  );
  const { account, env,signer } = useContext<any>(ChatAndNotificationPropsContext);

  const onSubscribeToChannel = useCallback(
    async ({ channelAddress }: onSubscribeToChannel) => {
      setLoading(true);
      try {
        if (!channelAddress) return;
        const address = channelAddress;

        if (!address) return;
        console.log(signer)
        const chainId = await signer.getChainId();

        await PushAPI.channels.subscribe({
          signer: signer,
          channelAddress: convertAddressToAddrCaip(channelAddress, chainId), // channel address in CAIP
          userAddress: convertAddressToAddrCaip(account, chainId), // user address in CAIP
          onSuccess: () => {
            //do something
            setChannelSubscriptionStatus(channelAddress,true);
            setSuccess(true);
          },
          onError: (err: any) => {
            setError(err.message);
          },
          env: env,
        });
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
        return;
      } finally {
        setLoading(false);
      }
    },
    [account, env]
  );

  return { onSubscribeToChannel, error, loading, success };
};

export default useOnSubscribeToChannel;
