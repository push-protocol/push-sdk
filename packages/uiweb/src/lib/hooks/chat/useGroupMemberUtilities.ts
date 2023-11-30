import { useCallback, useState } from 'react';
import { useChatData } from './useChatData';
import { GroupMembersType } from '../../components/chat/types';



interface fetchMembersParams {
  chatId:string;
  page:number,
  limit?:number,
}

const useGroupMemberUtilities = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { account, env, pushUser } = useChatData();


  const fetchMembers = useCallback(
    async ({ chatId ,page,limit=10 }: fetchMembersParams):Promise<GroupMembersType | undefined> => {
      setLoading(true);
      try {
        const response = await pushUser?.chat.group.participants(chatId,{page,limit});
        return response;
      } catch(error: Error | any) {
        console.log("err", error);
        setError(error.message);
        return error.message;
      }
    },
    [pushUser, env, account]
  )


  return { error, loading, fetchMembers, };
};

export default useGroupMemberUtilities;
