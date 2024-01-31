import { useCallback, useState } from 'react';
import { useChatData } from './useChatData';
import { GroupRolesKeys } from '../../components/chat/types';


interface updateGroupParams {
  chatId:string;
  role: GroupRolesKeys ;
  memberList: Array<string>;
}

const useUpdateGroup = () => {
  const [error, setError] = useState<string>();
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [removeLoading, setRemoveLoading] = useState<boolean>(false);
  const [modifyLoading, setModifyLoading] = useState<boolean>(false);

  const { account, env, user } = useChatData();


  const addMember = useCallback(
    async ({ role, memberList,chatId  }: updateGroupParams) => {
      setAddLoading(true);
      try {
        const response = await user?.chat.group.add(chatId, {
          role: role,
          accounts: memberList,
        });
        setAddLoading(false);

        return response;
      } catch(error: Error | any) {
        console.log("err", error);
        setAddLoading(false);
        setError(error.message);
        return error.message;
      }
    },
    [user, env, account]
  )
  const removeMember = useCallback(
    async ({ role, memberList,chatId  }: updateGroupParams) => {
      setRemoveLoading(true);
      try {
        const response = await user?.chat.group.remove(chatId, {
          role: role,
          accounts: memberList,
        });
        setRemoveLoading(false);

        return response;
      } catch(error: Error | any) {
        console.log("err", error);
        setRemoveLoading(false);

        setError(error.message);
        return error.message;
      }
    },
    [user, env, account]
  )
  const modifyParticipant = useCallback(
    async ({ role, memberList,chatId  }: updateGroupParams) => {
      setModifyLoading(true);
      try {
        const response = await user?.chat.group.modify(chatId, {
          role: role,
          accounts: memberList,
        });
        setModifyLoading(false);

        return response;
      } catch(error: Error | any) {
        console.log("err", error);
        setModifyLoading(false);

        setError(error.message);
        return error.message;
      }
    },
    [user, env, account]
  )

  return { error, addLoading,removeLoading,modifyLoading, addMember,removeMember,modifyParticipant };
};

export default useUpdateGroup;