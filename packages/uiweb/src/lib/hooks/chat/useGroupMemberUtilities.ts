import { useCallback, useState } from 'react';
import { useChatData } from './useChatData';
import { FetchGroupMembersResponseType } from '../../components/chat/types';



interface fetchMembersParams {
  chatId:string;
  page:number,
  limit?:number,
  pending?:boolean,
  role?: string
}

const useGroupMemberUtilities = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { account, env, pushUser } = useChatData();


  const fetchMembers = useCallback(
    async ({ chatId ,page,limit=10,pending = false }: fetchMembersParams):Promise<FetchGroupMembersResponseType | undefined> => {
      setLoading(true);
      try {
        console.log(pending)
        const response = await pushUser?.chat.group.participants.list(chatId,{page,limit, filter: {
            pending,
          }});
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
