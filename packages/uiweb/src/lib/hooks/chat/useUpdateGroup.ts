import { useCallback, useContext, useState } from 'react';
import { useChatData } from './useChatData';
import { IGroup } from '../../types';


interface updateGroupParams {
  groupInfo: IGroup;
  memberList: Array<string>;
  adminList: Array<string>;
}

const useUpdateGroup = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { account, env, pushUser } = useChatData();


  const updateGroup = useCallback(
    async ({ groupInfo, memberList, adminList }: updateGroupParams) => {
      setLoading(true);
      const payload = {
        groupName: groupInfo?.groupName,
        groupDescription: groupInfo?.groupDescription ?? '',
        groupImage: groupInfo?.groupImage,
        members: memberList,
        admins: adminList,
        private: !groupInfo?.isPublic,
        rules: groupInfo?.rules,
      }
      try {
        const updateResponse = await pushUser?.chat.group.update(groupInfo?.chatId, payload);
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
    [pushUser, env, account]
  );

  return { updateGroup, error, loading };
};

export default useUpdateGroup;
