import * as PushAPI from '@pushprotocol/restapi';
import { Env } from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { useChatData } from './useChatData';
import { IGroup } from '../../types';


interface updateGroupParams {
  groupInfo:IGroup;
  memberList:Array<string>;
  adminList:Array<string>;
}

const useUpdateGroup = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { account, env,pgpPrivateKey } = useChatData();


  const updateGroup = useCallback(
    async ({groupInfo,memberList,adminList}: updateGroupParams) => {
      setLoading(true);
      try {
        const updateResponse = await PushAPI.chat.updateGroup({
            chatId: groupInfo?.chatId,
            groupName: groupInfo?.groupName,
            groupDescription: groupInfo?.groupDescription ?? '',
            groupImage: groupInfo?.groupImage,
            members: memberList,
            admins: adminList,
            account: account,
            pgpPrivateKey: pgpPrivateKey,
            env: env,
          });
        return updateResponse;
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
        return;
      }
      finally {
        setLoading(false);
      }
    },
    [pgpPrivateKey,env,account]
  );

  return { updateGroup, error, loading };
};

export default useUpdateGroup;
